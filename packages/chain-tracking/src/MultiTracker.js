import exitHook from 'async-exit-hook'
import {List} from 'immutable'

/**
 * a MultiTracker connects to multiple contracts deployed in an Ethereum-like chain and tracks their respective events
 */
export class MultiTracker {
  static async from(factory, provider, polling, processLog = async _ => console.log(_), logger = console) {
    const marker = await factory.create()
    return new this(marker, provider, polling, processLog, logger)
  }

  constructor(marker, provider, polling, processLog, logger) {
    this.marker = marker
    this.provider = provider
    this.polling = polling
    this.processLog = processLog
    this.contracts = {}
    this.interfaces = {}
    this.topicsByKind = {}
    this.topics = [[]]
    this.logger = logger
    this.isRunning = false
    exitHook(() => this.stop())
  }
  get lastBlock() { return this.marker.block }
  get chainId() { return this.marker.chainId }
  get info() { return `tracker [${this.chainId}]` }

  addContract(contract, kind) {
    if (contract.runner.provider !== this.provider) throw Error(`contract @ ${contract.target} has incompatible provider`)
    if (!this.contracts[contract.target]) this.contracts[contract.target] = kind
    if (!this.interfaces[kind]) this.interfaces[kind] = contract.interface
    if (!this.topicsByKind[kind]) {
      const topics = contract.interface.fragments.filter(_ => _.type === 'event').map(_ => _.topicHash)
      this.topicsByKind[kind] = topics
      this.topics = [Array.from(new Set(this.topics[0].concat(topics)))]
    }
  }

  async start() {
    if (!this.isRunning) {
      await this.beforeStart()
      this.isRunning = true
      await this.pollForEvents()
    }
  }

  async beforeStart() {
    // telegram.post(`starting ${this.info}`)
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
    // telegram.post(`stopping ${this.info}`)
    this.logger.log(`stopping ${this.info}`)
  }

  fail(e) {
    this.logger.error(e, e.cause || '')
    // telegram.post(`TrackingFailure in ${this.info}`, e)
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
    const logs = await this.getLogsFor(fromBlock, toBlock, this.topics) // fixme: flatten topics
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
    const filter = {fromBlock, toBlock, topics}
    try {
      return await this.provider.getLogs(filter).then(_ => _.filter(_ => !_.removed))
    } catch (e) {
      if (fromBlock === toBlock) return this.getSingleBlockLogsFallback(fromBlock, toBlock)
      else {
        this.logger.info(`splitting blocks to read logs from:${fromBlock} to:${toBlock}`, e?.error?.message)
        const midway = fromBlock + Math.floor((toBlock - fromBlock) / 2)
        await this.processLogs(fromBlock, midway)
        await this.processLogs(midway + 1, toBlock)
      }
    }
  }

  async getSingleBlockLogsFallback(block) {
    this.logger.info(`falling back on getting logs per each contract at block ${fromBlock}`)
    const logs = []
    for (let [address, kind] of Object.entries(this.interfaces)) logs.push(
      await this.getLogsForContract(block, block, [topicsByKind[kind]], address)
    )
    return logs
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
    const {address} = log
    const kind = this.contracts[address]
    if (!kind) return null

    const {name, args} = this.interfaces[kind].parseLog(log)
    return {address, name, args}
  }
}

