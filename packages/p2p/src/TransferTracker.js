import {logger} from '@leverj/common/utils'
import * as chain from '@leverj/reactor.chain/contracts'
import exitHook from 'async-exit-hook'
import config from 'config'
import {Interface} from 'ethers'
import {List} from 'immutable'

const {polling} = config
const iface = new Interface(chain.abi.Vault.abi)
const Transfer = iface.getEvent('Transfer').topicHash
const topics = [Transfer]

class TrackerMarker {
  constructor(node, chainId, block = 0, logIndex = -1, blockWasProcessed = false) {
    this.node = node
    this.chainId = chainId
    this.block = block
    this.logIndex = logIndex
    this.blockWasProcessed = blockWasProcessed
  }
}

/**
 * a TransferTracker connects to a dedicated chain and tracks Transfer events of the Vault of said chain
 */
export class TransferTracker {
  static of(provider, chainId, startBlock) {
    const marker = new TrackerMarker(chainId, startBlock)
    return new this(provider, chainId, marker)
  }

  constructor(provider, chainId, marker) {
    this.contract = {}
    this.provider = provider
    this.chainId = chainId
    this.marker = marker
    this.isRunning = false
    exitHook(() => this.stop())
  }

  trackingInfo() { return `chain[${this.chainId}]` }

  async start() {
    if (!this.isRunning) {
      this.isRunning = true
      await this.pollForEvents()
    }
  }

  stop() {
    if (this.isRunning) {
      this.isRunning = false
      if (this.pollingTimer) clearTimeout(this.pollingTimer)
    }
  }

  fail(e) {
    logger.error(e, e.cause || '')
    this.stop()
  }

  async pollForEvents(attempts = 1) {
    try {
      await this.poll()
    } catch (e) {
      if (attempts === 1) logger.error(`tracker [${this.trackingInfo()}] failed during polling for events`, e, e.cause || '')
      return attempts === polling.attempts ? this.fail(e) : this.pollForEvents(attempts + 1)
    }
    if (this.isRunning) this.pollingTimer = setTimeout(this.pollForEvents.bind(this), polling.interval)
  }

  async poll() {
    const fromBlock = this.marker.block + (this.marker.blockWasProcessed ? 1 : 0)
    const toBlock = await this.provider.getBlockNumber()
    if (fromBlock <= toBlock) await this.processLogs(fromBlock, toBlock)
  }

  async processLogs(fromBlock, toBlock) {
    const filter = {fromBlock, toBlock, topics, address: this.contract}
    let logs = await this.provider.getLogs(filter).then(_ => _.filter(_ => !_.removed))
    const {block, logIndex, blockWasProcessed} = this.marker
    const logsPerBlock = List(logs).
      groupBy(_ => parseInt(_.blockNumber)). //fixme: do we need parseInt ?
      filter((_, key) => key >= filter.fromBlock).
      map((value, key) => key === block && !blockWasProcessed ? value.filter(_ => _.logIndex > logIndex) : value).
      map((value, _) => value.sortBy(_ => _.logIndex).toArray()).
      toKeyedSeq()
    for (let [block, blockLogs] of logsPerBlock) await this.onNewBlock(block, blockLogs)
    if (this.marker.block < toBlock) {
      this.marker.blockWasProcessed = true
      this.marker.block = toBlock
    }
  }

  update(state) { for (let [key, value] of Object.entries(state)) this.marker[key] = value }

  async onNewBlock(block, logs) {
    this.marker.blockWasProcessed = false
    if (this.marker.block < block) {
      this.marker.block = block
      this.marker.logIndex = -1
    }
    this.update(block > this.marker.block ? {block, logIndex: -1, blockWasProcessed: false} : {blockWasProcessed: false})
    for (let each of logs) {
      await this.node.processTransfer(iface.parseLog(each).args)
      this.marker.logIndex = each.logIndex
    }
    this.marker.blockWasProcessed = true
  }
}
