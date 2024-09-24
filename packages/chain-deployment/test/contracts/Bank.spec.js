import {accounts, chainId, deployContract} from '@leverj/chain-deployment/test'
import {expect} from 'expect'

describe('Bank', () => {
  const [, account] = accounts
  const amount = 1000n

  it('can deposit & withdraw ERC20 Token', async () => {
    const bank = await deployContract('Bank', [chainId, '🥱'])
    const erc20 = await deployContract('ERC20Mock', ['Crap', 'CRAP'])
    await erc20.mint(account.address, amount)
    await erc20.connect(account).approve(bank.target, amount).then(_ => _.wait())

    expect(await bank.balances(account, erc20.target)).toEqual(0n)
    await bank.connect(account).deposit(erc20.target, amount).then(_ => _.wait())
    expect(await bank.balances(account, erc20.target)).toEqual(amount)

    await bank.connect(account).withdraw(erc20.target, amount / 10n).then(_ => _.wait())
    expect(await bank.balances(account, erc20.target)).toEqual(amount / 10n * 9n)
  })
})
