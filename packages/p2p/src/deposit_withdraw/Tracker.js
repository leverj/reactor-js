import exitHook from 'async-exit-hook'
import {getAddress, Interface} from 'ethers'
import {List} from 'immutable'
import {compact} from 'lodash-es'
import { Marker } from './Marker.js'
import {affirm, InvalidArgument, logger, telegram} from '@leverj/common/utils'
import abi1 from '../../artifacts/contracts/L1Vault.sol/L1Vault.json' assert {type: 'json'}
import abi2 from '../../artifacts/contracts/L2Vault.sol/L2Vault.json' assert {type: 'json'}

//FIXME needs to come from config
  const polling = {
    interval: 1 * 1000,
    attempts: 5
  }

  //FIXME Tracker is basically for {Chain, Contract, Topic}. Send via constructor, and should be read as env/config
const topics = ["0xc6d85822d86b60b41984292074ead1b48e583535e9e12c2098fe3f6b04a56444"]
const ifaces = {
    L1Vault: new Interface(abi1.abi),
    L2Vault: new Interface(abi2.abi),
  }

export class Tracker {
  static async of(provider, chainId, startBlock) {
    /*const marker = await TrackerMarker.exists({chainId}) ?
      await TrackerMarker.findOne({chainId}) :
      await TrackerMarker.create({chainId, block: startBlock})*/
    const marker = Marker.getMarker(chainId)  
    return new this(provider, chainId, marker)
  }

  constructor(provider, chainId, marker) {
    this.contracts = {}
    this.provider = provider
    this.chainId = chainId
    this.marker = marker
    this.isRunning = false
    this.components = {}
    exitHook(() => this.stop())
  }

  get lastBlock() { return this.marker.block }

  trackingInfo() { return `chain[${this.chainId}]` }

  setContracts(contracts) { this.contracts = contracts }
  addContract(address, kind) {console.log("Tracker: addContract", address, kind);  this.contracts[address] = kind }
  addComponent(component, id){this.components[id] = component}
  async start() {
    console.log("Tracker.start", this.isRunning)
    if (!this.isRunning) {
      this.isRunning = true
      await this.pollForEvents()
      //telegram.post(`${this.trackingInfo()} has been started`)
    }
  }

  stop() {
    if (this.isRunning) {
      this.isRunning = false
      if (this.pollingTimer) clearTimeout(this.pollingTimer)
      //telegram.post(`${this.trackingInfo()} has been stopped`) //FIXME uncomment after everything else works and integrate TG then
    }
  }

  fail(e) {
    logger.error(e, e.cause || '')
    telegram.post(`TrackingFailure in ${this.trackingInfo()}`, e)
    this.stop()
  }

  async pollForEvents(attempts = 1) {
    console.log("pollForEvents")
    try {
      await this.poll()
    } catch (e) {
        console.log("Poll err", e)
      if (attempts === 1) logger.error(`tracker [${this.trackingInfo()}] failed during polling for events`, e, e.cause || '')
      this.marker = Marker.getMarker(this.chainId)
      return attempts === polling.attempts ? this.fail(e) : this.pollForEvents(attempts + 1)
    }
    if (this.isRunning) this.pollingTimer = setTimeout(this.pollForEvents.bind(this), polling.interval)
  }

  async poll() {
    //FIXME uncomment once we can export these state variables from the Marker class
    //const fromBlock = this.lastBlock + (this.marker.blockWasProcessed ? 1 : 0) 
    const fromBlock = 1
    const toBlock = await this.provider.getBlockNumber()
    console.log("poll", fromBlock, toBlock)
    if (fromBlock <= toBlock) await this.processLogs(fromBlock, toBlock)
  }

  async getSingleBlockLogsFallback(fromBlock, toBlock) {
    logger.info(`falling back on getting logs per each contract at block ${fromBlock}`)
    const logs = []
    for (let [address, kind] of Object.entries(this.contracts)) {
      const filter = {fromBlock, toBlock, address, topics: [topicsByKind[kind]]}
      logs.push(await this.provider.getLogs(filter).then(_ => _.filter(_ => !_.removed)))
    }
    return logs
  }

  async processLogs(fromBlock, toBlock) {
    console.log("processLogs", fromBlock, toBlock)
    affirm(toBlock >= fromBlock , `invalid get logs parameters, from: ${fromBlock}, to: ${toBlock} ` )
    const filter = {fromBlock, toBlock, topics}
    let logs
    try {
      logs = await this.provider.getLogs(filter).then(_ => _.filter(_ => !_.removed))
      console.log("provider.getLogs", logs)
    } catch (e) {
      if (fromBlock === toBlock) logs = await this.getSingleBlockLogsFallback(fromBlock, toBlock)
      else {
        logger.info(`splitting blocks to read logs from:${fromBlock} to:${toBlock}`, e?.error?.message)
        const midway = fromBlock + Math.floor((toBlock - fromBlock) / 2)
        await this.processLogs(fromBlock, midway)
        await this.processLogs(midway + 1, toBlock)
      }
    }
    const {block, logIndex, blockWasProcessed} = this.marker //FIXME how to expose these as exports in Marker class
    const logsPerBlock = List(logs).
      groupBy(_ => parseInt(_.blockNumber)).
      filter((_, key) => key >= filter.fromBlock).
      map((value, key) => key === block && !blockWasProcessed ? value.filter(_ => _.logIndex > logIndex) : value).
      map((value, _) => value.sortBy(_ => _.logIndex).toArray()).
      toKeyedSeq()
    for (let [block, blockLogs] of logsPerBlock) await this.onNewBlock(block, blockLogs)
    if (this.lastBlock < toBlock) await this.update({block: toBlock, blockWasProcessed: true})
  }

  parseLog(log) {
    const {chainId} = this
    const {address, blockNumber, logIndex, transactionHash} = log
    const kind = this.contracts[address]
    if (!kind) return null

    const {name, args} = ifaces[kind].parseLog(log)
    logger.log('tracker:', JSON.stringify({chainId, blockNumber, logIndex, transactionHash, contract: address, event: name, args}))
    return {
      kind,
      address: getAddress(address),
      blockNumber,
      logIndex,
      name,
      args,
      transactionHash
    }
  }

  async onNewBlock(block, logs) {
    await this.update(block > this.lastBlock ? {block, logIndex: -1, blockWasProcessed: false} : {blockWasProcessed: false})
    const events = compact(logs.map(_ => this.parseLog(_)))
    for (let each of events) {
      await this.components[each.kind].consume(each)
    }
    await this.update({blockWasProcessed: true})
  }

  async update(state) {
    //for (let [key, value] of Object.entries(state)) this.marker.set(key, value) //FIXME uncomment once mongo is configured
    //await this.marker.save()
  }

  async onEvent(event, session) {
    switch (event.kind) {
      
    }
  }

}
``