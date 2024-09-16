import {accounts, provider} from '@leverj/chain-deployment/test'
import {uint} from '@leverj/common'
import {events, stubs} from '@leverj/reactor.chain/contracts'
import {publicKey, Vault} from '@leverj/reactor.chain/test'
import {expect} from 'expect'

const {Transfer} = events.Vault

describe.skip('Contract stub', () => {
  const [, account] = accounts
  let stub

  beforeEach(async () => {
    const contract = await Vault(fromChainId, publicKey)
    stub = stubs.Vault(contract.target, account)
  })

  it('can filter on past Transfer events', async () => {
    const [chainId, chainName, nativeSymbol, nativeDecimals] = await stub.home(), NATIVE = await stub.NATIVE()
    const startingAtBlock = await provider.getBlockNumber()
    const howMany = 5
    for (let i = 0; i < howMany; i++) await stub.sendNative(toChainId, {value: deposit + uint(i)}).then(_ => _.wait())

    const events = await stub.runner.provider.getLogs({
      fromBlock: startingAtBlock,
      address: stub.target,
      topics: [Transfer.topic],
    }).then(_ => _.map(_ => ({blockNumber: _.blockNumber, ...stub.interface.parseLog(_)})))
    expect(events).toHaveLength(howMany)
    for (let i = 0; i < howMany; i++) {
      const event = events[i]
      const {transferHash, origin, token, name, symbol, decimals, amount, owner, from, to, tag} = event.args
      expect(event.blockNumber).toEqual(startingAtBlock + i + 1)
      expect(origin).toEqual(chainId)
      expect(token).toEqual(NATIVE)
      expect(name).toEqual(chainName)
      expect(symbol).toEqual(nativeSymbol)
      expect(decimals).toEqual(nativeDecimals)
      expect(amount).toEqual(deposit + uint(i))
      expect(owner).toEqual(account.address)
      expect(from).toEqual(chainId)
      expect(to).toEqual(toChainId)
      expect(tag).toEqual(uint(i + 1))
      expect(await stub.sends(transferHash)).toEqual(true)
    }
    expect(await stub.sendCounter()).toEqual(uint(howMany))
  })
})
