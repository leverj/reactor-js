import {logger} from '@leverj/common/utils'
import * as chain from '@leverj/reactor.chain/contracts'
import exitHook from 'async-exit-hook'
import config from 'config'
import {Interface} from 'ethers'
import {List} from 'immutable'
import {max} from 'lodash-es'
import {JsonStore} from './utils/index.js'

const {bridgeNode, polling} = config
const {abi, stubs} = chain
const iface = new Interface(abi.Vault.abi)

export class TrackerMarker {
  static of(store, chainId) {
    const {block, logIndex, blockWasProcessed} = store.get(chainId, {block: 0, logIndex: -1, blockWasProcessed: false})
    return new this(store, chainId, block, logIndex, blockWasProcessed)
  }
  constructor(store, chainId, block, logIndex, blockWasProcessed) {
    this.store = store
    this.chainId = chainId
    this.block = block
    this.logIndex = logIndex
    this.blockWasProcessed = blockWasProcessed
  }

  async update(state) {
    Object.assign(this, state)
    const {chainId, block, logIndex, blockWasProcessed} = this
    this.store.set(chainId, {block, logIndex, blockWasProcessed})
  }
}

/**
 * a TransferTracker connects to a Vault and tracks its Transfer events
 */
export class TransferTracker {
  static async of(node, address, provider, store) {
    if (!store) store = new JsonStore(`${bridgeNode.confDir}/tracker-marker`) //fixme: temporary
    const vault = stubs.Vault(address, provider)
    const marker = TrackerMarker.of(store, await provider.getNetwork().then(_ => _.chainId))
    return new this(node, vault, marker)
  }

  constructor(node, vault, marker) {
    this.node = node
    this.vault = vault
    this.marker = marker
    this.isRunning = false
    exitHook(() => this.stop())
  }

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
      if (attempts === 1) logger.error(`tracker [${this.marker.chainId}:${this.vault.target}] failed during polling for events`, e, e.cause || '')
      return attempts === polling.attempts ? this.fail(e) : this.pollForEvents(attempts + 1)
    }
    if (this.isRunning) this.pollingTimer = setTimeout(this.pollForEvents.bind(this), polling.interval)
  }

  async poll() {
    const fromBlock = this.marker.block + (this.marker.blockWasProcessed ? 1 : 0)
    if (fromBlock <= await this.vault.provider.getBlockNumber()) await this.processLogs(fromBlock)
  }

  async processLogs(fromBlock) {
    const logs = await this.vault.queryFilter('Transfer', fromBlock).then(_ => _.filter(_ => !_.removed))
    const {block, logIndex, blockWasProcessed} = this.marker
    const logsPerBlock = List(logs).
      groupBy(_ => parseInt(_.blockNumber)). //fixme: do we need parseInt ?
      filter((_, key) => key >= fromBlock).
      map((value, key) => key === block && !blockWasProcessed ? value.filter(_ => _.logIndex > logIndex) : value).
      map((value, _) => value.sortBy(_ => _.logIndex).toArray()).
      toKeyedSeq()
    // const toBlock = max(logs.map(_ => _.blockNumber))
    const toBlock = max(Object.keys(logsPerBlock))
    for (let [block, blockLogs] of logsPerBlock) await this.onNewBlock(block, blockLogs)
    if (this.marker.block < toBlock) this.marker.update({block: toBlock, blockWasProcessed: true})
  }

  async onNewBlock(block, logs) {
    this.marker.update(block > this.marker.block ? {block, logIndex: -1, blockWasProcessed: false} : {blockWasProcessed: false})
    for (let each of logs) {
      await this.node.processTransfer(iface.parseLog(each).args)
      this.marker.update({logIndex: each.logIndex})
    }
    this.marker.update({blockWasProcessed: true})
  }
}
