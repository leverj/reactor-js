export class TrackerMarker {
  static of(store, chainId) {
    const {block, logIndex, blockWasProcessed} = store.get(chainId, {block: 0, logIndex: -1, blockWasProcessed: false})
    return new this(store, chainId, block, logIndex, blockWasProcessed)
  }

  constructor(store, chainId, block, logIndex, blockWasProcessed) {
    this.store = store
    this.chainId = chainId
    this.block = block
    this.logIndex = logIndex
    this.blockWasProcessed = blockWasProcessed
  }

  async update(state) {
    Object.assign(this, state)
    const {chainId, block, logIndex, blockWasProcessed} = this
    this.store.set(chainId, {block, logIndex, blockWasProcessed})
  }
}
