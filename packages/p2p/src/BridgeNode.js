import {affirm, logger} from '@leverj/common'
import {encodeTransfer} from '@leverj/reactor.chain/contracts'
import {
  deserializeHexStrToPublicKey,
  deserializeHexStrToSignature,
  G1ToNumbers,
  G2ToNumbers,
  SecretKey,
} from '@leverj/reactor.mcl'
import {setTimeout} from 'node:timers/promises'
import config from '../config.js'
import {NetworkNode} from './NetworkNode.js'
import {TssNode} from './TssNode.js'
import {events, INFO_CHANGED, PEER_DISCOVERY, waitToSync} from './utils.js'

const {timeout, port} = config

const TSS_RECEIVE_SIGNATURE_SHARE = 'TSS_RECEIVE_SIGNATURE_SHARE'
const SIGNATURE_START = 'SIGNATURE_START'
const WHITELIST_TOPIC = 'WHITELIST'
const WHITELIST_REQUEST = 'WHITELIST_REQUEST'
const DKG_INIT_THRESHOLD_VECTORS = 'DKG_INIT_THRESHOLD_VECTORS'
const DKG_RECEIVE_KEY_SHARE = 'DKG_RECEIVE_KEY_SHARE'
const meshProtocol = '/bridge/0.0.1'

export class BridgeNode {
  static async from(port, bootstrapNodes, data = {}) {
    const {p2p, tssNode, whitelist, leader} = data
    const network = await NetworkNode.from(port, p2p, bootstrapNodes)
    const tss = new TssNode(network.peerId, tssNode)
    tss.addMember(tss.idHex, tss.onDkgShare.bind(tss)) // making self dkg share
    return new this(network, tss,  new Whitelist(whitelist || []), leader, bootstrapNodes.length === 0)
  }

  constructor(network, tss, whitelist, leader, isLeader) {
    this.network = network
    this.tss = tss
    this.whitelist = whitelist
    this.leader = leader
    this.leadership = isLeader ? new Leader(this) : new Follower(this)
    this.messageMap = {}
    this.vaults = {}
    this.trackers = {}
    this.monitor = new Monitor()
    this.network.registerStreamHandler(meshProtocol, this.onStreamMessage.bind(this))
    this.addPeersToWhiteList(...this.whitelist.initial)
    this.leadership.listenToPeerDiscovery()
  }

  get multiaddrs() { return this.network.multiaddrs }
  get peerId() { return this.network.peerId }
  get peers() { return this.network.peers }
  get port() { return port } //fixme: how come?
  // get port() { return this.network.port }
  get signer() { return this.tss.idHex }
  get secretKeyShare() { return this.tss.secretKeyShare.serializeToHexStr() }
  get groupPublicKey() { return this.tss.groupPublicKey.serializeToHexStr() }
  get publicKey() { return G2ToNumbers(deserializeHexStrToPublicKey(this.groupPublicKey)) }

  getAggregateSignature(transferHash) { return this.messageMap[transferHash] }

  print() { this.tss.print() }

  info() {
    return {
      p2p: this.network.info(),
      tssNode: this.tss.info(),
      whitelist: this.whitelist.get(),
      leader: this.leader,
    }
  }

  trackChain(tracker) { //fixme:tracker
    this.trackers[tracker.chainId] = tracker
    this.vaults[tracker.chainId] = tracker.contract
  }

  setVaultForChain(chainId, vault) {
    this.vaults[chainId] = vault
  }

  async processTransfer(args) { return this.leadership.processTransfer(args) }
  async aggregateSignature(message, chainId, transferCallback) { return this.leadership.aggregateSignature(message, chainId, transferCallback) }
  async publishWhitelist() { return this.leadership.publishWhitelist() }
  async startDKG(threshold) { return this.leadership.startDKG(threshold) }

  async start() {
    await this.network.start()
    await this.leadership.addLeader()
    events.emit(INFO_CHANGED)
    this.ping()
  }

  async stop() { return this.network.stop() }

  async connect(peerId) { return this.network.connect(peerId) }

  async ping() {
    const peerIds = this.whitelist.get()
    for (let each of peerIds) if (each !== this.peerId) {
      this.monitor.updateLatency(each, await this.network.ping(each))
      await setTimeout(timeout)
    }
    setTimeout(timeout).then(this.ping.bind(this))
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

  handleWhitelistMessage(peerId, peerIds) {
    this.leader === peerId ?
      this.addPeersToWhiteList(...peerIds) :
      logger.log('ignoring whitelist from non-leader', peerId)
  }

  async handleSignatureStart(peerId, data) {
    if (this.leader !== peerId) return logger.log('ignoring signature start from non-leader', peerId, this.leader)

    //fixme: note: for local e2e testing, which will not have any contracts or hardhat, till we expand the scope of e2e
    const verifyTransferHash = async (chainId, transferHash) => chainId === -1 || this.vaults[chainId].checkouts(transferHash)

    const {message: transferHash, chainId} = data
    if (await verifyTransferHash(chainId, transferHash)) {
      const signature = this.tss.sign(transferHash).serializeToHexStr()
      logger.log(SIGNATURE_START, transferHash, signature)
      const signaturePayloadToLeader = {
        topic: TSS_RECEIVE_SIGNATURE_SHARE,
        signature,
        signer: this.signer,
        transferHash,
      }
      await this.network.createAndSendMessage(peerId, meshProtocol, JSON.stringify(signaturePayloadToLeader), _ => logger.log('SignaruePayload Ack', _))
    }
  }

  async onStreamMessage(stream, peerId, msgStr) {
    const message = JSON.parse(msgStr)
    affirm(this.whitelist.exists(peerId, `Unknown peer ${peerId}`))
    switch (message.topic) {
      case WHITELIST_REQUEST:
        return this.whitelist.canPublish ? this.sendMessageToPeer(peerId, WHITELIST_TOPIC, this.whitelist.get()) : {}
      case WHITELIST_TOPIC:
        return this.handleWhitelistMessage(peerId, message.message)
      case DKG_INIT_THRESHOLD_VECTORS:
        return this.tss.generateVectorsAndContribution(message.threshold)
      case DKG_RECEIVE_KEY_SHARE:
        return this.tss.onDkgShare(message.message)
      case TSS_RECEIVE_SIGNATURE_SHARE:
        const {transferHash, signature, signer} = message
        const info = this.messageMap[transferHash]
        info.signatures[signer] = {signature, signer}
        logger.log('Received signature', transferHash, signature)
        if (Object.keys(info.signatures).length === this.tss.threshold) {
          const groupSign = this.tss.groupSign(Object.values(info.signatures))
          info.groupSign = groupSign
          info.verified = this.tss.verify(groupSign, info.signatures[this.signer].message)
          logger.log('Verified', transferHash, info.verified, groupSign)
          info.transferCallback(info)
        }
        return
      case SIGNATURE_START:
        return this.handleSignatureStart(peerId, JSON.parse(message.message))
      default:
        logger.log('Unknown message', message)
    }
  }
}

class Leader {
  constructor(self) { this.self = self}

  async addLeader() {
    this.self.leader = this.self.peerId
    this.self.addPeersToWhiteList(this.self.leader)
  }

  listenToPeerDiscovery() { events.on(PEER_DISCOVERY, _ => this.self.addPeersToWhiteList(_)) }

  async processTransfer(args) {
    const transferPayloadVerified = async (to, payload, aggregateSignature) => {
      if (aggregateSignature.verified) {
        const signature = G1ToNumbers(deserializeHexStrToSignature(aggregateSignature.groupSign))
        const publicKey = this.self.publicKey
        const toContract = this.self.vaults[to]
        await toContract.checkIn(signature, publicKey, payload).then(_ => _.wait())
      }
    }
    const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = args
    const payload = encodeTransfer(origin, token, name, symbol, decimals, amount, owner, from, to, tag)
    if (await this.self.vaults[from].checkouts(transferHash)) {
      await this.self.aggregateSignature(
        transferHash,
        from,
        async (signature) => transferPayloadVerified(to, payload, signature),
      )
      return transferHash
    }
  }

  async aggregateSignature(message, chainId, transferCallback) {
    const signature = this.self.tss.sign(message).serializeToHexStr()
    const signer = this.self.signer
    this.self.messageMap[message] = {
      signatures: {
        [signer]: {message, signature, signer}
      },
      verified: false,
      transferCallback,
    }
    await this.publishOrFanOut(SIGNATURE_START, JSON.stringify({message, chainId}), this.self.monitor.filter(this.self.whitelist.get()))
  }

  async publishWhitelist() {
    this.self.whitelist.canPublish = true
    const message = this.self.whitelist.get()
    await this.publishOrFanOut(WHITELIST_TOPIC, message, this.self.monitor.filter(message))
  }

  async publishOrFanOut(topic, message, peerIds, fanOut = true) {
    if (fanOut) {
      for (let each of peerIds) if (each !== this.self.peerId) await this.self.sendMessageToPeer(each, topic, message)
    } else await this.self.network.publish(topic, message)
  }

  async startDKG(threshold) {
    const responseHandler = (message) => logger.log('dkg received', message)
    for (let each of this.self.whitelist.get()) if (each !== this.self.peerId) {
      const message = JSON.stringify({topic: DKG_INIT_THRESHOLD_VECTORS, threshold})
      await this.self.network.createAndSendMessage(each, meshProtocol, message, responseHandler)
    }
    await this.self.tss.generateVectorsAndContribution(threshold)
  }
}

class Follower {
  constructor(self) { this.self = self}

  async addLeader() {
    this.self.leader = this.self.network.bootstrapNodes[0].split('/').pop()
    this.self.addPeersToWhiteList(this.self.leader)
    await waitToSync([_ => this.self.peers.includes(this.self.leader)], -1, timeout, port)
    await this.self.sendMessageToPeer(this.self.leader, WHITELIST_REQUEST, '')
  }
  listenToPeerDiscovery() {}
  async processTransfer(log) {}
  async aggregateSignature(message, chainId, transferCallback) {}
  async publishWhitelist() {}
  async startDKG(threshold) {}
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
