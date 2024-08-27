import {InMemoryStore, TrackerMarkerFactory} from '@leverj/chain-tracking'
import {expect} from 'expect'

describe('TrackerMarker', () => {
  it('can get and update', async () => {
    const store = new InMemoryStore()
    {
      const marker = await TrackerMarkerFactory(store, 10101).create()
      expect(marker).toMatchObject({block: 0, logIndex: -1, blockWasProcessed: false})

      await marker.update({block: 11, blockWasProcessed: true})
      expect(marker).toMatchObject({block: 11, logIndex: -1, blockWasProcessed: true})

      await marker.update({block: 22, logIndex: 4})
    }
    {
      const marker = await TrackerMarkerFactory(store, 21212).create()
      expect(marker).toMatchObject({block: 0, logIndex: -1, blockWasProcessed: false})

      await marker.update({block: 3})
      await marker.update({logIndex: 4})
      await marker.update({blockWasProcessed: true})
      expect(marker).toMatchObject({block: 3, logIndex: 4, blockWasProcessed: true})

      await marker.update({logIndex: 9})
    }
    expect(await TrackerMarkerFactory(store, 10101).create()).toMatchObject({block: 22, logIndex: 4, blockWasProcessed: true})
    expect(await TrackerMarkerFactory(store, 21212).create()).toMatchObject({block: 3, logIndex: 9, blockWasProcessed: true})
  })
})
