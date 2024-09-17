import {InMemoryStore} from '@leverj/common'
import exitHook from 'async-exit-hook'
import {Contract} from 'ethers'
import {List, Map} from 'immutable'
import {merge} from 'lodash-es'
import {ContractTracker} from './ContractTracker.js'
import {getCreationBlock} from './evm.js'

/**
 * a MultiContractTracker connects to multiple contracts deployed in an Ethereum-like chain and tracks their respective events
 */
export class MultiContractTracker {
  static from(chainId, provider, store, polling, processEvent = logger.log, logger = console) {
    const key = chainId
    store.update(key, {
      marker: {block: 0, logIndex: -1, blockWasProcessed: false},
      abis: [],
      contracts: [],
      toOnboard: [],
    })
    return new this(chainId, provider, store, key, polling, processEvent, logger)
  }

  constructor(chainId, provider, store, key, polling, processEvent, logger) {
    this.chainId = chainId
    this.provider = provider
    this.store = store
    this.key = key
    this.polling = polling
    this.processEvent = processEvent
    this.logger = logger
    this.contracts = {}
    this.interfaces = {}
    this.topicsByKind = {}
    this.topics = [[]]
    this.isRunning = false
    const {marker, toOnboard, abis, contracts} = store.get(key)
    this.marker = marker
    this.toOnboard = toOnboard
    const ifaces = Map(abis).toObject()
    Map(contracts).forEach(
      (kind, address) => this._addContract_(new Contract(address, ifaces[kind], provider), kind)
    )
    exitHook(() => this.stop())
  }
  get lastBlock() { return this.marker.block }

  async update(state) { return this.store.update(this.key, state) }
  async updateMarker(state) { return this.update({marker: merge(this.marker, state)}) }

  _addContract_(contract, kind) {
    const {runner: {provider}, target: address, interface: iface} = contract
    if (provider !== this.provider) throw Error(`contract @ ${address} has incompatible provider`)
    if (!this.contracts[address]) this.contracts[address] = kind
    if (!this.interfaces[kind]) this.interfaces[kind] = iface
    if (!this.topicsByKind[kind]) {
      const topics = iface.fragments.filter(_ => _.type === 'event').map(_ => _.topicHash)
      this.topicsByKind[kind] = topics
      this.topics = [Array.from(new Set(this.topics[0].concat(topics)))]
    }
  }

  async addContract(contract, kind) {
    this._addContract_(contract, kind)
    return this.isRunning ?
      this.onboard(contract) :
      this.scheduleToOnboard(contract.target, kind)
  }

  async scheduleToOnboard(address, kind) {
    this.toOnboard.push({address, kind})
    await this.update({toOnboard: this.toOnboard})
  }

  async onboard(contract) {
    const {chainId, provider, polling, processEvent, logger, lastBlock} = this
    const tracker = ContractTracker.of(chainId, contract, new InMemoryStore(), polling, processEvent, logger)
    const creationBlock = await getCreationBlock(provider, contract.target).catch(_ => 0)
    await tracker.processLogs(creationBlock, lastBlock)
    await this.update({
      contracts: Map(this.contracts).toArray(),
      abis: Map(this.interfaces).map(_ => _.format()).toArray(),
    })
  }

  async start() {
    if (!this.isRunning) {
      this.logger.log(`starting tracker [${this.key}]`)
      while (this.toOnboard.length > 0)  {
        const {address, kind} = this.toOnboard.shift()
        const contract = new Contract(address, this.interfaces[kind], this.provider)
        await this.onboard(contract, kind)
      }
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
    if (this.lastBlock < toBlock) await this.updateMarker({block: toBlock, blockWasProcessed: true})
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
    this.logger.info(`falling back on getting logs per each contract at block ${block}`)
    const logs = []
    for (let [address, kind] of Object.entries(this.interfaces)) logs.push(
      await this.getLogsForContract(block, block, [this.topicsByKind[kind]], address)
    )
    return logs
  }

  async getLogsForContract(fromBlock, toBlock, topics, address) {
    return this.provider.getLogs({fromBlock, toBlock, address, topics}).then(_ => _.filter(_ => !_.removed))
  }

  async onNewBlock(block, logs) {
    await this.updateMarker(block > this.lastBlock ? {block, logIndex: -1, blockWasProcessed: false} : {blockWasProcessed: false})
    for (let each of logs) if (this.contracts[each.address]) {
      const event = this.toEvent(each)
      await this.processEvent(event)
      await this.updateMarker({logIndex: each.logIndex})
    }
    await this.updateMarker({blockWasProcessed: true})
  }

  toEvent(log) {
    const {address} = log
    const kind = this.contracts[address]
    const {name, args} = this.interfaces[kind].parseLog(log)
    return {address, name, args}
  }
}

