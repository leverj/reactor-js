import exitHook from 'async-exit-hook'
import {List} from 'immutable'

/**
 * each Tracker connects to a dedicated Ethereum network (i.e.: Ethereum Homestead) and tracks events of interest
 * for either a specific contract (i.e: a XXX:fixme:), or a set of specific same-class contracts  (i.e: ERC20).
 */
export class MultiTracker {
  constructor(provider, marker, polling, processLog = async _ => console.log(_), logger) {
    this.contracts = {}
    this.interfaces = {}
    this.topics = []
    this.provider = provider
    this.marker = marker
    this.polling = polling
    this.processLog = processLog
    this.logger = logger
    this.isRunning = false
    exitHook(() => this.stop())
  }
  get lastBlock() { return this.marker.block }
  get chainId() { return this.marker.chainId }
  get info() { return `tracker [${this.chainId}]` }

  setContracts(contracts) { contracts.forEach((contract, kind) => this.addContract(contract, kind)) }
  addContract(contract, kind) {
    this.contracts[contract.target] = kind
    this.interfaces[kind] = contract.interface
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

  // //fixme: subclass
  // async beforeStart() {
  //   await super.beforeStart()
  //   const collections = await Collection.find({chainId: this.chainId}).lean()
  //   for (let {address, specialized: {kind}} of collections) this.addContract(address, kind)
  //   return this
  // }

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
      this.marker.reload() // refresh the marker
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
    if (this.lastBlock < toBlock) this.marker.update({block: toBlock, blockWasProcessed: true})
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
    this.marker.update(block > this.lastBlock ? {block, logIndex: -1, blockWasProcessed: false} : {blockWasProcessed: false})
    for (let each of logs) {
      const log = this.parseLog(each)
      if (log) await this.processLog(log)
      this.marker.update({logIndex: each.logIndex})
    }
    this.marker.update({blockWasProcessed: true})
  }

  parseLog(log) {
    const kind = this.contracts[log.address]
    return kind ? this.interfaces[kind].parseLog(log) : null
  }
}

