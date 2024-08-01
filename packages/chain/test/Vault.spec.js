import {provider, Vault} from '@leverj/reactor.chain/test'
import {AbiCoder, keccak256} from 'ethers'
import {expect} from 'expect'
import {setTimeout} from 'node:timers/promises'

describe('Vault', () => {
  it.skip('should mint token using fixture data', async () => {
    const network = await provider.getNetwork()
    const fixture = {
      sig_ser: [
        '17501379548414473118975493418296770409004790518587989275104077991423278766345',
        '10573459840926036933226410278548182531900093958496894445083855256191507622572',
      ],
      pubkey_ser: [
        '17952266123624120693867949189877327115939693121746953888788663343366186261263',
        '3625386958213971493190482798835911536597490696820041295198885612842303573644',
        '14209805107538060976447556508818330114663332071460618570948978043188559362801',
        '6106226559240500500676195643085343038285250451936828952647773685858315556632',
      ],
      vaultUser: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      token: '0x0000000000000000000000000000000000000000',
      decimals: 18n,
      toChainId: 10101n,
      amount: 1000000n,
      depositCounter: 0n,
    }
    const contract = await Vault(network.chainId, fixture.pubkey_ser)
    await contract.mint(fixture.sig_ser, fixture.pubkey_ser, AbiCoder.defaultAbiCoder().encode(
      ['address', 'address', 'uint', 'uint', 'uint', 'uint', 'uint', 'string', 'string'],
      [fixture.vaultUser, fixture.token, BigInt(fixture.decimals), BigInt(network.chainId), BigInt(fixture.toChainId), BigInt(fixture.amount), BigInt(fixture.depositCounter), 'PROXY_NAME', 'PROXY_SYMBOL'],
    ))
    await setTimeout(1000)
    const depositHash = keccak256(fixture.vaultUser, fixture.token, BigInt(fixture.decimals), BigInt(fixture.toChainId), BigInt(fixture.amount), BigInt(fixture.depositCounter))
    const minted = await contract.minted(depositHash)
    expect(minted).toEqual(true)

    const proxyToken = await contract.proxyMapping(BigInt(network.chainId), fixture.token)
    const proxyBalanceOfDepositor = await contract.balanceOf(proxyToken, fixture.vaultUser)
    expect(fixture.amount).toEqual(proxyBalanceOfDepositor)
  })
})
