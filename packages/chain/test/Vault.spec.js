import {ETH} from '@leverj/common/utils'
import {ERC20, getContractAt, getSigners, provider, Vault} from '@leverj/reactor.chain/test'
import {expect} from 'expect'
import {deserializeHexStrToPublicKey, G2ToNumbers} from '@leverj/reactor.mcl'

const [owner, account] = await getSigners()
const network = await provider.getNetwork()
const from = network.chainId, to = 10101, amount = 1000n
// const publicKey = G2ToNumbers(deserializeHexStrToPublicKey('aaefd7f4788ba7f19e2d8be297f6ea91e04c850d16f80e08be4cb768d08f192a60afe4481f4f9cf8faac59ed801b1543ad491097be5d08235ea1298fed864720'))
const publicKey = G2ToNumbers(deserializeHexStrToPublicKey('bcc7c1f8e2f35273c429092217c8ae5ab282ea27815a670c7c3160c8e5a60010ddc0c6b0c46288e77121e8b74a2d899f92929787400e12c8b483af3aa23e382a'))

describe.skip('Vault', () => {
  it('checkOutNative', async () => {
    const fromVault = await Vault(from, publicKey)
    const toVault = await Vault(to, publicKey)

    await fromVault.checkOutNative(to, {value: amount}).then(_ => _.wait())
    const transferHash = null
    expect(await toVault.inTransfers(transferHash)).toEqual(true)

    const proxyAddress = await toVault.proxies(L1, ETH)
    const proxy = await getContractAt('ERC20Proxy', proxyAddress)
    expect(amount).toEqual(await proxy.balanceOf(owner.address))
    expect(await toVault.isCheckedIn(proxyAddress)).toEqual(true)

    const receipt = await toVault.checkOutToken(L1, proxyAddress, amount).then(_ => _.wait())
    expect(0n).toEqual(await proxy.balanceOf(owner.address))
    // const log = await provider.getLogs(receipt).then(_ => _[1])
    // await leader.processTransfer(log)
    // await setTimeout(10)
    // // fixme: make gas price 0 and test ETH balance
    // // const after = await provider.getBalance(owner)
    // // expect(before).toEqual(after)
  })

  it('checkOutToken', async () => {
    const [fromVault, toVault] = await deployVaultPerChainOnNodes([from, to])

    const supply = 1000000000n
    const token = await ERC20('USD_TETHER', 'USDT')
    await token.mint(account, supply)
    await token.connect(account).approve(fromVault.target, amount, {from: account.address}).then(_ => _.wait())
    await fromVault.connect(account).checkOutToken(to, token.target, amount).then(_ => _.wait())
    const transferHash = null
    expect(await toVault.inTransfers(transferHash)).toEqual(true)

    const proxyToken = await toVault.proxies(from, token.target)
    const proxy = await getContractAt('ERC20Proxy', proxyToken)
    expect(amount).toEqual(await proxy.balanceOf(account))
    expect(await token.balanceOf(account)).toEqual(supply - amount)

    await proxy.approve(toVault.target, amount)
    await toVault.connect(account).checkOutToken(from, proxyToken, amount).then(_ => _.wait())
    // for (let each of await provider.getLogs(withdrawReceipt)) if (each.address === toVault.target) await leader.processTransfer(each)
    expect(await token.balanceOf(account)).toEqual(supply)
  })

  it('checkIn', async () => {
    // checkIn(uint[2] calldata signature, uint[4] calldata signerPublicKey, bytes calldata payload)
  })

  it('should mint token using fixture data', async () => {
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
      owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      token: '0x0000000000000000000000000000000000000000',
      decimals: 18n,
      to: 10101n,
      amount: 1000000n,
    }
    const {sig_ser, pubkey_ser, owner, token, decimals, to, amount} = fixture
    const contract = await Vault(network.chainId, pubkey_ser)
    // await contract.mint(sig_ser, pubkey_ser, AbiCoder.defaultAbiCoder().encode(
    //   ['address', 'address', 'uint', 'uint', 'uint', 'uint', 'uint', 'string', 'string'],
    //   [owner, token, BigInt(decimals), BigInt(network.chain), BigInt(to), BigInt(amount), BigInt(depositCounter), 'PROXY_NAME', 'PROXY_SYMBOL'],
    // ))
    // await setTimeout(1000)
    // const depositHash = keccak256(owner, token, BigInt(decimals), BigInt(to), BigInt(amount), BigInt(depositCounter))
    // const minted = await contract.minted(depositHash)
    // expect(minted).toEqual(true)
    //
    // const proxyToken = await contract.proxies(BigInt(network.chain), token)
    // const proxyBalanceOfDepositor = await contract.balanceOf(proxyToken, owner)
    // expect(amount).toEqual(proxyBalanceOfDepositor)
  })
})
