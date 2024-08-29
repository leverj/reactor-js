import {Map} from 'immutable'
import {Chain} from './evm.js'
import {Contract} from 'ethers'

export class MultiChainContractCoordinator {
  constructor() {
    this.chains = Map().asMutable()
    this.contracts = Map().asMutable()
  }

  chain(chainId) { return this.chains.get(chainId) }
  provider(chainId) { return this.chain(chainId).provider }
  contract(chainId, address) { return this.contracts.getIn([chainId, address]) }

  async joinChain(provider) {
    const chain = await Chain.from(provider)
    this.chains.set(chain.chainId, chain)
  }

  joinContract(chainId, address, abi) {
    const contract = new Contract(address, abi, this.provider(chainId))
    this.contracts.setIn([chainId, address], contract)
    return contract
  }

  start() {}
  stop() {}
}
