import {ETH} from '@leverj/common/utils'
import * as chain from '@leverj/reactor.chain/contracts'
import {G1ToNumbers, G2ToNumbers, newKeyPair, sign} from '@leverj/reactor.mcl'
import {AbiCoder, Interface, keccak256} from 'ethers'
import {expect} from 'expect'
import {ERC20, getContractAt, getSigners, provider, Vault} from './help/index.js'

const iface = new Interface(chain.abi.Vault.abi)
const [, account] = await getSigners()

describe.only('Vault', () => {
  const signer = newKeyPair()
  const publicKey = G2ToNumbers(signer.pubkey)
  const fromChainId = 10101n, toChainId = 98989n
  const deposit = 1000n

  const toPayload = (origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter) => AbiCoder.defaultAbiCoder().encode(
    // ['uint64', 'address', 'string', 'string', 'uint8', 'uint', 'address', 'uint64', 'uint64', 'uint'],
    // [origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter]
    ['uint64', 'address', 'uint8', 'uint', 'address', 'uint64', 'uint64', 'uint'],
    [origin, token, decimals, amount, owner, from, to, sendCounter],
  )
  const computeHash = (origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter) => keccak256(toPayload(origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter))


  it('checkOut - Native', async () => {
    const vault = await Vault(fromChainId, publicKey)
    const [chainId, chainName, nativeSymbol, nativeDecimals] = await vault.home()
    const logs = await provider.getLogs(await vault.connect(account).checkOutNative(toChainId, {value: deposit}).then(_ => _.wait()))
    const {origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter} = iface.parseLog(logs[0]).args
    expect(chainId).toEqual(origin)
    expect(await vault.NATIVE()).toEqual(token)
    expect(chainName).toEqual(name)
    expect(nativeSymbol).toEqual(symbol)
    expect(nativeDecimals).toEqual(decimals)
    expect(deposit).toEqual(amount)
    expect(account.address).toEqual(owner)
    expect(chainId).toEqual(from)
    expect(toChainId).toEqual(to)
    expect(await vault.sendCounter()).toEqual(sendCounter)

    const transferHash = computeHash(origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter)
    expect(await vault.outTransfers(transferHash)).toEqual(true)
  })

  it('checkOut - Token', async () => {
    const vault = await Vault(fromChainId, publicKey)
    const erc20 = await ERC20()
    await erc20.mint(account, 1000000000n)
    await erc20.connect(account).approve(vault.target, deposit).then(_ => _.wait())

    const logs = await provider.getLogs(await vault.connect(account).checkOutToken(toChainId, erc20.target, deposit).then(_ => _.wait()))
    const {origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter} = iface.parseLog(logs[1]).args
    expect(fromChainId).toEqual(origin)
    expect(erc20.target).toEqual(token)
    expect(await erc20.name()).toEqual(name)
    expect(await erc20.symbol()).toEqual(symbol)
    expect(await erc20.decimals()).toEqual(decimals)
    expect(deposit).toEqual(amount)
    expect(account.address).toEqual(owner)
    expect(fromChainId).toEqual(from)
    expect(toChainId).toEqual(to)
    expect(await vault.sendCounter()).toEqual(sendCounter)

    const transferHash = computeHash(origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter)
    expect(await vault.outTransfers(transferHash)).toEqual(true)
  })

  it('checkIn - Native', async () => {
    const fromVault = await Vault(fromChainId, publicKey), toVault = await Vault(toChainId, publicKey)
    const logs = await provider.getLogs(await fromVault.connect(account).checkOutNative(toChainId, {value: deposit}).then(_ => _.wait()))
    const {origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter} = iface.parseLog(logs[0]).args
    const transferHash = computeHash(origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter)
    expect(fromChainId).toEqual(origin)

    expect(await toVault.inTransfers(transferHash)).toEqual(false)
    const signature = G1ToNumbers(sign(transferHash, signer.secret).signature)
    const payload = toPayload(origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter)
    await toVault.checkIn(signature, publicKey, payload, name, symbol).then(_ => _.wait())
    expect(await toVault.inTransfers(transferHash)).toEqual(true)

    const proxyAddress = await toVault.proxies(fromChainId, ETH)
    const proxy = await getContractAt('ERC20Proxy', proxyAddress)
    expect(amount).toEqual(await proxy.balanceOf(owner))
    expect(await toVault.isCheckedIn(proxyAddress)).toEqual(true)
  })

  it('checkIn - Token', async () => {
    const fromVault = await Vault(fromChainId, publicKey), toVault = await Vault(toChainId, publicKey)
    const erc20 = await ERC20()
    await erc20.mint(account, 1000000000n)
    await erc20.connect(account).approve(fromVault.target, deposit).then(_ => _.wait())
    const logs = await provider.getLogs(await fromVault.connect(account).checkOutToken(toChainId, erc20.target, deposit).then(_ => _.wait()))
    const {origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter} = iface.parseLog(logs[1]).args
    const transferHash = computeHash(origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter)
    expect(fromChainId).toEqual(origin)

    expect(await toVault.inTransfers(transferHash)).toEqual(false)
    const signature = G1ToNumbers(sign(transferHash, signer.secret).signature)
    const payload = toPayload(origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter)
    await toVault.checkIn(signature, publicKey, payload, name, symbol).then(_ => _.wait()) //fixme: how to enforce only peers can checkIn ???
    expect(await toVault.inTransfers(transferHash)).toEqual(true)

    const proxyAddress = await toVault.proxies(fromChainId, erc20.target)
    const proxy = await getContractAt('ERC20Proxy', proxyAddress)
    expect(amount).toEqual(await proxy.balanceOf(owner))
    expect(await toVault.isCheckedIn(proxyAddress)).toEqual(true)
  })
})
