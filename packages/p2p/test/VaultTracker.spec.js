import {expect} from 'expect'
import {bytes32_0, keccak256} from '@leverj/common/utils'
import {stubs} from '@leverj/reactor.chain/contracts'
import {ERC20, getSigners, Vault} from '@leverj/reactor.chain/test'
import {VaultTracker} from '../src/VaultTracker.js'
import {G2ToNumbers, newKeyPair} from '@leverj/reactor.mcl'

const [, account, creator, anyone] = await getSigners()

describe('VaultTracker', () => {
  const signer = newKeyPair(), publicKey = G2ToNumbers(signer.pubkey)
  const fromChainId = 10101n, toChainId = 98989n
  const deposit = 1000n
  let erc20, vault, tracker

  beforeEach(async () => {
    vault = await Vault(fromChainId, publicKey)
    erc20 = await ERC20()
    await erc20.mint(account.address, deposit)
    await erc20.connect(account).approve(vault.target, deposit).then(_ => _.wait())
    const polling = {interval: 10, attempts: 5}
    const store = new Map()
    const node = {processLog: _ => console.log(_.args)}
    tracker = await VaultTracker.of(vault, polling, store, node)
  })
  afterEach(() => tracker.stop())

  it('can track BaseUriUpdate event emitted by tracked ERC1155 collections', async () => {
    await publishCollection(vault, creator, label, howManyTokens, supply)
    await tracker.poll()
    const before = await Collection.findOne({chainId})
    const modifiedBaseURI = `ipfs://${keccak256(label)}`

    const stub = stubs.TradableCollection(before.address, creator)
    await (await stub.updateBaseURI(modifiedBaseURI)).wait()
    await tracker.poll()
    const after = await Collection.findOne({chainId})
    expect(after.specialized.baseURI).toEqual(modifiedBaseURI)
  })

  it('can track TransferSingle & TransferBatch events emitted by tracked ERC1155 collections', async () => {
    expect(Object.keys(tracker.contracts).length).toBe(1) // collections will be added as they are created via event emitter

    for (let i = 0; i < howManyCollections; i++) await publishCollection(vault, creator, i, howManyTokens, supply)
    await tracker.poll()
    const collections = await Collection.find({chainId}, 'address').then(_ => _.map(_ => _.address))
    expect(collections.length).toBe(howManyCollections)
    expect(Object.keys(tracker.contracts).length).toBe(1 + howManyCollections)

    const collectionStubs = collections.map(_ => stubs.TradableCollection(_))

    // transfer from creator to anyone
    for (let i = 0; i < howManyCollections; i++) {
      const tokenId = i
      const stub = collectionStubs[i].connect(creator)
      await (await stub.safeTransferFrom(creator.address, anyone.address, tokenId, supply === 1 ? supply : supply - i, bytes32_0)).wait() // emit TransferSingle
      await tracker.poll()
      expect(await tokenHoldingOf(creator.address, collections[i], tokenId)).toEqual(supply === 1 ? 0 : i)
      expect(await tokenHoldingOf(anyone.address, collections[i], tokenId)).toEqual(supply === 1 ? supply : supply - i)
    }

    // transfer from anyone back to creator
    for (let i = 0; i < howManyCollections; i++) { // reverse previous transfers
      const tokenId = i
      const stub = collectionStubs[i].connect(anyone)
      await (await stub.safeBatchTransferFrom(anyone.address, creator.address, [tokenId], [supply === 1 ? supply : supply - i], bytes32_0)).wait() // emit TransferBatch
      await tracker.poll()
      expect(await tokenHoldingOf(creator.address, collections[i], tokenId)).toEqual(supply)
      expect(await tokenHoldingOf(anyone.address, collections[i], tokenId)).toEqual(0)
    }

    // transfer in-batch from creator to anyone
    const tokenIds = new Array(howManyTokens).fill(1).map((v, i) => i)
    const amounts = new Array(howManyTokens).fill(supply)
    const stub = collectionStubs[0].connect(creator)
    await (await stub.safeBatchTransferFrom(creator.address, anyone.address,  tokenIds, amounts, bytes32_0)).wait() // emit TransferBatch
    await tracker.poll()
    for (let each of tokenIds) {
      expect(await tokenHoldingOf(creator.address, collections[0], each)).toEqual(0)
      expect(await tokenHoldingOf(anyone.address, collections[0], each)).toEqual(supply)
    }

    expect(await TrackerMarker.countDocuments({chainId})).toBe(1)
    expect(await TrackerMarker.findOne({chainId}).lean()).toMatchObject({
      block: await evm.getBlockNumber(),
      blockWasProcessed: true,
    })
  })
})
