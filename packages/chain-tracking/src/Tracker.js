import exitHook from 'async-exit-hook'
import {List} from 'immutable'

/**
 * a Tracker connects to a contract deployed in an Ethereum-like chain and tracks its events
 */
export class Tracker {
  static async from(factory, contract, topics, polling, processLog = async _ => console.log(_), logger = console) {
    const marker = await factory.create()
    return new this(marker, contract, topics, polling, processLog, logger)
  }

  constructor(marker, contract, topics, polling, processLog, logger) {
    this.marker = marker
    this.contract = contract
    this.topics = [topics]
    this.polling = polling
    this.processLog = processLog
    this.logger = logger
    this.isRunning = false
    exitHook(() => this.stop())
  }
  get interface() { return this.contract.interface }
  get provider() { return this.contract.runner.provider }
  get target() { return this.contract.target }
  get lastBlock() { return this.marker.block }
  get chainId() { return this.marker.chainId }
  get info() { return `tracker [${this.chainId}:${this.target}]` }

  async start() {
    if (!this.isRunning) {
      await this.beforeStart()
      this.isRunning = true
      await this.pollForEvents()
    }
  }

  async beforeStart() {
    this.logger.log(`starting ${this.info}`)
  }


  stop() {
    if (this.isRunning) {
      this.beforeStop()
      this.isRunning = false
      if (this.pollingTimer) clearTimeout(this.pollingTimer)
    }
  }

  beforeStop() {
    this.logger.log(`stopping ${this.info}`)
  }

  fail(e) {
    this.logger.error(e, e.cause || '')
    this.stop()
  }

  async pollForEvents(attempts = 1) {
    try {
      await this.poll()
    } catch (e) {
      if (attempts === 1) this.logger.error(`${this.info} failed during polling for events`, e, e.cause || '')
      await this.marker.reload() // refresh the marker
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
    if (this.lastBlock < toBlock) await this.marker.update({block: toBlock, blockWasProcessed: true})
  }

  async getLogsFor(fromBlock, toBlock, topics) {
    return this.getLogsForContract(fromBlock, toBlock, topics, this.target)
  }

  async getLogsForContract(fromBlock, toBlock, topics, address) {
    return this.provider.getLogs({fromBlock, toBlock, address, topics}).then(_ => _.filter(_ => !_.removed))
  }

  async onNewBlock(block, logs) {
    await this.marker.update(block > this.lastBlock ? {block, logIndex: -1, blockWasProcessed: false} : {blockWasProcessed: false})
    for (let each of logs) {
      const log = this.parseLog(each)
      await this.processLog(log)
      await this.marker.update({logIndex: each.logIndex})
    }
    await this.marker.update({blockWasProcessed: true})
  }

  parseLog(log) {
    return this.interface.parseLog(log)
  }
}
