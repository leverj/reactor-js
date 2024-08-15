import {affirm, logger} from '@leverj/common/utils'
import * as chain from '@leverj/reactor.chain/contracts'
import {
  deserializeHexStrToPublicKey,
  deserializeHexStrToSignature,
  G1ToNumbers,
  G2ToNumbers,
  SecretKey,
} from '@leverj/reactor.mcl'
import {AbiCoder, Interface, keccak256} from 'ethers'
import {setTimeout} from 'node:timers/promises'
import {NetworkNode} from './NetworkNode.js'
import {TssNode} from './TssNode.js'
import {events, INFO_CHANGED, PEER_DISCOVERY, waitToSync} from './utils/index.js'

const iface = new Interface(chain.abi.Vault.abi)

const TSS_RECEIVE_SIGNATURE_SHARE = 'TSS_RECEIVE_SIGNATURE_SHARE'
const SIGNATURE_START = 'SIGNATURE_START'
const WHITELIST_TOPIC = 'WHITELIST'
const WHITELIST_REQUEST = 'WHITELIST_REQUEST'
const DKG_INIT_THRESHOLD_VECTORS = 'DKG_INIT_THRESHOLD_VECTORS'
const DKG_RECEIVE_KEY_SHARE = 'DKG_RECEIVE_KEY_SHARE'
const meshProtocol = '/bridgeNode/0.0.1'

export class BridgeNode {
  static async from({ip = '0.0.0.0', port = 0, isLeader = false, json, bootstrapNodes}) {
    const network = await NetworkNode.from({ip, port, peerIdJson: json?.p2p, bootstrapNodes})
    const tss = new TssNode(network.peerId, json?.tssNode)
    tss.addMember(tss.id.serializeToHexStr(), tss.onDkgShare.bind(tss)) // making self dkg share
    const whitelist = new Whitelist(json?.whitelist || [])
    return new this(network, tss, whitelist, isLeader, json?.leader)
  }

  constructor(network, tss, whitelist, isLeader, leader) {
    this.network = network
    this.tss = tss
    this.whitelist = whitelist
    this.isLeader = isLeader
    this.leader = leader
    this.messageMap = {}
    this.vaults = {}
    this.monitor = new Monitor()
    this.network.registerStreamHandler(meshProtocol, this.onStreamMessage.bind(this))
    this.addPeersToWhiteList(...this.whitelist.initial)
    // fixme: changes when real whitelisting done
    if (this.isLeader) events.on(PEER_DISCOVERY, _ => this.addPeersToWhiteList(_))
  }

  get bootstrapNodes() { return this.network.bootstrapNodes }
  get multiaddrs() { return this.network.multiaddrs }
  get peerId() { return this.network.peerId }
  get peers() { return this.network.peers }
  get secretKeyShare() { return this.tss.secretKeyShare }
  get groupPublicKey() { return this.tss.groupPublicKey }

  getAggregateSignature(txnHash) { return this.messageMap[txnHash] }

  setVaultForChain(chain, vault) { this.vaults[chain] = vault }

  async processTransfer(log) {
    if (this.isLeader) {
      const {origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter} = iface.parseLog(log).args
      const transferHash = keccak256(AbiCoder.defaultAbiCoder().encode( // fixme: no need for decimals in hash?
        // ['uint64', 'address', 'string', 'string', 'uint8', 'uint', 'address', 'uint64', 'uint64', 'uint'],
        // [origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter]
        ['uint64', 'address', 'uint8', 'uint', 'address', 'uint64', 'uint64', 'uint'],
        [origin, token, decimals, amount, owner, from, to, sendCounter]
      ))
      if (await this.vaults[from].outTransfers(transferHash)) {
        await this.aggregateSignature(
          transferHash,
          transferHash, //fixme: can we remove this duplication
          from,
          async (signature) => this.transferPayloadVerified(origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter, signature),
        )
        return transferHash
      }
    }
  }

  async transferPayloadVerified(origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter, aggregateSignature) {
    // fixme: aggregateSignature is undefined
    if (aggregateSignature.verified) {
      const signature = G1ToNumbers(deserializeHexStrToSignature(aggregateSignature.groupSign))
      const publicKey = G2ToNumbers(deserializeHexStrToPublicKey(this.groupPublicKey.serializeToHexStr()))
      const toContract = this.vaults[to]
      await toContract.checkIn(signature, publicKey, AbiCoder.defaultAbiCoder().encode(
        // ['uint64', 'address', 'string', 'string', 'uint8', 'uint', 'address', 'uint64', 'uint64', 'uint'],
        // [origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter],
        ['uint64', 'address', 'uint8', 'uint', 'address', 'uint64', 'uint64', 'uint'],
        [origin, token, decimals, amount, owner, from, to, sendCounter],
      ), name, symbol).then(_ => _.wait())
    }
  }

  async verifyTransferHash(chain, transferHash) {
    if (chain === -1) return true // note: for local e2e testing, which will not  have any contracts or hardhat, till we expand the scope of e2e
    return this.vaults[chain].outTransfers(transferHash)
  }

  print() { this.tss.print() }

  exportJson() {
    return {
      p2p: this.network.exportJson(),
      tssNode: this.tss.exportJson(),
      whitelist: this.whitelist.get(),
      leader: this.leader,
    }
  }

  async start() {
    await this.network.start()
    await this.addLeader()
    if (!this.isLeader) await this.sendMessageToPeer(this.leader, WHITELIST_REQUEST, '')
    events.emit(INFO_CHANGED)
    this.ping()
    return this
  }

  async stop() { return this.network.stop() }

  async connect(peerId) { return this.network.connect(peerId) }

  async addLeader() {
    this.leader = this.isLeader ? this.peerId : this.bootstrapNodes[0].split('/').pop()
    this.addPeersToWhiteList(this.leader)
    if (!this.isLeader) await waitToSync([_ => this.peers.includes(this.leader)], -1)
  }

  addPeersToWhiteList(...peerIds) {
    if (peerIds.length > 0) {
      for (let each of peerIds) {
        const dkgId = this.whitelist.add(each)
        if (each !== this.peerId) this.tss.addMember(dkgId, this.sendMessageToPeer.bind(this, each, DKG_RECEIVE_KEY_SHARE))
      }
      logger.log('Added to whitelist', peerIds.map(_ => `${_.slice(0, 4)}..${_.slice(-3)}`).join(', '))
      events.emit(INFO_CHANGED)
    }
  }

  async publishWhitelist() {
    if (this.isLeader) {
      this.whitelist.canPublish = true
      const whitelist = this.whitelist.get()
      await this.publishOrFanOut(WHITELIST_TOPIC, whitelist, this.monitor.filter(whitelist))
    }
  }

  async publishOrFanOut(topic, message, peerIds, fanOut = true) {
    if (fanOut) {
      for (let each of peerIds) if (each !== this.peerId) await this.sendMessageToPeer(each, topic, message)
    } else await this.network.publish(topic, message)
  }

  async aggregateSignature(txnHash, message, chainId, transferCallback) {
    const signature = this.tss.sign(message).serializeToHexStr()
    const signer = this.tss.id.serializeToHexStr()
    this.messageMap[txnHash] = {
      signatures: {
        [signer]: {
          message,
          signature,
          signer, //fixme: signer is already the key
        }
      },
      verified: false,
      transferCallback,
    }
    await this.publishOrFanOut(SIGNATURE_START, JSON.stringify({txnHash, message, chainId}), this.monitor.filter(this.whitelist.get()))
  }

  async sendMessageToPeer(peerId, topic, message) {
    const responseHandler = _ => logger.log(`${topic} response from ${peerId} `, _)
    await this.network.createAndSendMessage(peerId, meshProtocol, JSON.stringify({topic, message}), responseHandler)
  }

  async connectPubSub(peerId) {
    return this.network.connectPubSub(peerId, this.onPubSubMessage.bind(this))
  }

  async onPubSubMessage({peerId, topic, data}) {
    switch (topic) {
      case WHITELIST_TOPIC: return this.handleWhitelistMessage(peerId, JSON.parse(data))
      case SIGNATURE_START: return this.handleSignatureStart(peerId, JSON.parse(data))
      default: logger.log('Unknown topic', topic)
    }
  }

  async handleWhitelistMessage(peerId, peerIds) {
    this.leader === peerId ?
      this.addPeersToWhiteList(...peerIds) :
      logger.log('Ignoring whitelist from non-leader', peerId)
  }

  async handleSignatureStart(peerId, data) {
    if (this.leader !== peerId) return logger.log('Ignoring signature start from non-leader', peerId, this.leader)

    const {txnHash, message, chainId} = data //fixme: txnHash & message are probably a duplication here
    if (await this.verifyTransferHash(chainId, message)) {
      const signature = await this.tss.sign(message)
      logger.log(SIGNATURE_START, txnHash, message, signature.serializeToHexStr())
      const signaturePayloadToLeader = {
        topic: TSS_RECEIVE_SIGNATURE_SHARE,
        signature: signature.serializeToHexStr(),
        signer: this.tss.id.serializeToHexStr(),
        txnHash,
      }
      await this.network.createAndSendMessage(peerId, meshProtocol, JSON.stringify(signaturePayloadToLeader), _ => logger.log('SignaruePayload Ack', _))
    }
  }

  async onStreamMessage(stream, peerId, msgStr) {
    const msg = JSON.parse(msgStr)
    affirm(this.whitelist.exists(peerId, `Unknown peer ${peerId}`))
    switch (msg.topic) {
      case WHITELIST_REQUEST:
        return this.whitelist.canPublish ? this.sendMessageToPeer(peerId, WHITELIST_TOPIC, this.whitelist.get()) : {}
      case WHITELIST_TOPIC:
        return this.handleWhitelistMessage(peerId, msg.message)
      case DKG_INIT_THRESHOLD_VECTORS:
        return this.tss.generateVectorsAndContribution(msg.threshold)
      case DKG_RECEIVE_KEY_SHARE:
        return this.tss.onDkgShare(msg.message)
      case TSS_RECEIVE_SIGNATURE_SHARE:
        const {txnHash, signature, signer} = msg
        const info = this.messageMap[txnHash]
        info.signatures[signer] = ({signature, signer})
        logger.log('Received signature', txnHash, signature)
        if (Object.keys(info.signatures).length === this.tss.threshold) {
          const groupSign = this.tss.groupSign(Object.values(info.signatures))
          info.groupSign = groupSign
          info.verified = this.tss.verify(groupSign, info.signatures[this.tss.id.serializeToHexStr()].message)
          logger.log('Verified', txnHash, info.verified, groupSign)
          info.transferCallback(info)
        }
        return
      case SIGNATURE_START:
        return this.handleSignatureStart(peerId, JSON.parse(msg.message))
      default:
        logger.log('Unknown message', msg)
    }
  }

  async startDKG(threshold) {
    if (this.isLeader) {
      const responseHandler = (msg) => logger.log('dkg received', msg)
      for (let each of this.whitelist.get()) if (each !== this.peerId) {
        const message = JSON.stringify({topic: DKG_INIT_THRESHOLD_VECTORS, threshold})
        await this.network.createAndSendMessage(each, meshProtocol, message, responseHandler)
      }
      await this.tss.generateVectorsAndContribution(threshold)
    }
  }

  async ping() {
    const peerIds = this.whitelist.get()
    for (let each of peerIds) if (each !== this.peerId) {
      this.monitor.updateLatency(each, await this.network.ping(each))
      await setTimeout(100) // fixme: parameterize timeout?
    }
    setTimeout(1000).then(this.ping.bind(this)) // fixme: parameterize timeout?
  }
}

class Whitelist {
  constructor(initial) {
    this.allowed = {}
    this.initial = initial
    this.canPublish = false
  }

  exists(peerId) { return this.allowed[peerId] }
  get() { return Object.keys(this.allowed) }
  add(peerId) {
    this.allowed[peerId] = new SecretKey().setHashOfString(peerId).serializeToHexStr()
    return this.allowed[peerId]
  }
}

class Monitor {
  constructor() { this.peers = {} }

  updateLatency(peerId, latency) {
    if (!this.peers[peerId]) this.peers[peerId] = {}
    this.peers[peerId].latency = latency
  }
  getPeersStatus() { return Object.entries(this.peers).map(([peerId, {latency}]) => ({peerId, latency})) }
  filter(peerIds) { return peerIds.filter(_ => this.peers[_]?.latency !== -1)}
  print() { logger.table(this.peers) }
}
