import exitHook from 'async-exit-hook'
import {Contract} from 'ethers'
import {List} from 'immutable'
import {merge} from 'lodash-es'

/**
 * a ContractTracker connects to a contract deployed in an Ethereum-like chain and tracks its events
 */
export class ContractTracker {
  static defaults({contract, topics}) {
    const result = {marker: {block: 0, logIndex: -1, blockWasProcessed: false}}
    if (contract) result.abi = contract.interface.format()
    if (topics) result.topics = [topics]
    return result
  }

  static from(store, chainId, address, provider, defaults, polling, processEvent = logger.log, logger = console) {
    const key = [chainId, address].join(':')
    store.update(key, this.defaults(defaults))
    return new this(store, chainId, address, provider, polling, processEvent, logger)
  }

  constructor(store, chainId, address, provider, polling, processEvent, logger) {
    this.store = store
    this.key = [chainId, address].join(':')
    this.address = address
    this.provider = provider
    this.polling = polling
    this.processEvent = processEvent
    this.logger = logger
    this.isRunning = false
    this.load()
    exitHook(() => this.stop())
  }
  get interface() { return this.contract.interface }
  get lastBlock() { return this.marker.block }

  load() {
    const {abi, topics, marker} = this.store.get(this.key)
    this.contract = new Contract(this.address, abi, this.provider)
    this.topics = topics
    this.marker = marker
  }

  update(state) { this.store.update(this.key, state) }
  updateMarker(state) { this.update({marker: merge(this.marker, state)}) }

  async start() {
    if (!this.isRunning) {
      this.logger.log(`starting tracker [${this.key}]`)
      this.isRunning = true
      await this.pollForEvents()
    }
  }

  stop() {
    if (this.isRunning) {
      this.logger.log(`stopping tracker [${this.key}]`)
      this.isRunning = false
      if (this.pollingTimer) clearTimeout(this.pollingTimer)
    }
  }

  fail(e) {
    this.logger.error(e, e.cause || '')
    this.stop()
  }

  async pollForEvents(attempts = 1) {
    try {
      await this.poll()
    } catch (e) {
      if (attempts === 1) this.logger.error(`tracker [${this.key}] failed during polling for events`, e, e.cause || '')
      return attempts === this.polling.attempts ? this.fail(e) : this.pollForEvents(attempts + 1)
    }
    if (this.isRunning) this.pollingTimer = setTimeout(_ => this.pollForEvents(_), this.polling.interval)
  }

  async poll() {
    const fromBlock = this.lastBlock + (this.marker.blockWasProcessed ? 1 : 0)
    const toBlock = await this.provider.getBlockNumber()
    if (fromBlock <= toBlock) await this.processLogs(fromBlock, toBlock)
  }

  async processLogs(fromBlock, toBlock) {
    const logs = await this.getLogsFor(fromBlock, toBlock, this.topics)
    const {block, logIndex, blockWasProcessed} = this.marker
    const logsPerBlock = List(logs).
      groupBy(_ => _.blockNumber).
      filter((_, key) => key >= fromBlock).
      map((value, key) => key === block && !blockWasProcessed ? value.filter(_ => _.logIndex > logIndex) : value).
      map((value, _) => value.sortBy(_ => _.logIndex).toArray()).
      toKeyedSeq()
    for (let [block, blockLogs] of logsPerBlock) await this.onNewBlock(block, blockLogs)
    if (this.lastBlock < toBlock) this.updateMarker({block: toBlock, blockWasProcessed: true})
  }

  async getLogsFor(fromBlock, toBlock, topics) {
    return this.getLogsForContract(fromBlock, toBlock, topics, this.address)
  }

  async getLogsForContract(fromBlock, toBlock, topics, address) {
    return this.provider.getLogs({fromBlock, toBlock, address, topics}).then(_ => _.filter(_ => !_.removed))
  }

  async onNewBlock(block, logs) {
    this.updateMarker(block > this.lastBlock ? {block, logIndex: -1, blockWasProcessed: false} : {blockWasProcessed: false})
    for (let each of logs) {
      const event = this.toEvent(each)
      await this.processEvent(event)
      this.updateMarker({logIndex: each.logIndex})
    }
    this.updateMarker({blockWasProcessed: true})
  }

  toEvent(log) {
    const address = this.address
    const {name, args} = this.interface.parseLog(log)
    return {address, name, args}
  }
}
