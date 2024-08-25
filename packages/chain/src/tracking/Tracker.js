import {logger} from '@leverj/common/utils'
import exitHook from 'async-exit-hook'
import {List} from 'immutable'
import {max} from 'lodash-es'

/** a Tracker connects to a contract and tracks its events **/
export class Tracker {
  constructor(contract, topics, polling, marker, processLog = async _ => logger.log(_)) {
    this.contract = contract
    this.topics = [topics]
    this.polling = polling
    this.marker = marker
    this.processLog = processLog
    this.isRunning = false
    exitHook(() => this.stop())
  }
  get interface() { return this.contract.interface }
  get provider() { return this.contract.runner.provider }
  get target() { return this.contract.target }
  get chainId() { return this.marker.chainId }

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
      if (attempts === 1) logger.error(`tracker [${this.marker.chainId}:${this.target}] failed during polling for events`, e, e.cause || '')
      return attempts === this.polling.attempts ? this.fail(e) : this.pollForEvents(attempts + 1)
    }
    if (this.isRunning) this.pollingTimer = setTimeout(this.pollForEvents.bind(this), this.polling.interval)
  }

  async poll() {
    const fromBlock = this.marker.block + (this.marker.blockWasProcessed ? 1 : 0)
    if (fromBlock <= await this.provider.getBlockNumber()) await this.processLogs(fromBlock)
  }

  async processLogs(fromBlock) {
    const filter = {fromBlock, address: this.target, topics: this.topics}
    const logs = await this.provider.getLogs(filter).then(_ => _.filter(_ => !_.removed))
    const {block, logIndex, blockWasProcessed} = this.marker
    const logsPerBlock = List(logs).
      groupBy(_ => _.blockNumber).
      filter((_, key) => key >= fromBlock).
      map((value, key) => key === block && !blockWasProcessed ? value.filter(_ => _.logIndex > logIndex) : value).
      map((value, _) => value.sortBy(_ => _.logIndex).toArray()).
      toKeyedSeq()
    const toBlock = max(logs.map(_ => _.blockNumber))
    for (let [block, blockLogs] of logsPerBlock) await this.onNewBlock(block, blockLogs)
    if (this.marker.block < toBlock) this.marker.update({block: toBlock, blockWasProcessed: true})
  }

  async onNewBlock(block, logs) {
    this.marker.update(block > this.marker.block ? {block, logIndex: -1, blockWasProcessed: false} : {blockWasProcessed: false})
    for (let each of logs) {
      const log = this.interface.parseLog(each)
      await this.processLog(log)
      this.marker.update({logIndex: each.logIndex})
    }
    this.marker.update({blockWasProcessed: true})
  }
}
