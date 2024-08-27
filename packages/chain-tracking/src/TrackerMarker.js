export function TrackerMarkerFactory(store, chainId) {
  return {
    create: async () => new TrackerMarker(store, chainId)
  }
}

export class TrackerMarker {
  constructor(store, chainId) {
    this.store = store
    this.chainId = chainId
    this.load()
  }

  load() {
    const {block, logIndex, blockWasProcessed} = this.store.get(this.chainId, {block: 0, logIndex: -1, blockWasProcessed: false})
    this.block = block
    this.logIndex = logIndex
    this.blockWasProcessed = blockWasProcessed
  }

  async reload() { this.load() }

  async update(state) {
    Object.assign(this, state)
    const {chainId, block, logIndex, blockWasProcessed} = this
    this.store.set(chainId, {block, logIndex, blockWasProcessed})
  }
}
