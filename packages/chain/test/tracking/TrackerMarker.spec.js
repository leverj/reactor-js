import {TrackerMarker} from '@leverj/reactor.chain/tracking'
import {expect} from 'expect'
import {InMemoryStore} from './help.js'

describe('TrackerMarker', () => {
  const store = new InMemoryStore()

  beforeEach(() => store.clear())

  it('can get and update', () => {
    {
      const marker = TrackerMarker.of(store, 10101)
      expect(marker).toMatchObject({block: 0, logIndex: -1, blockWasProcessed: false})

      marker.update({block: 11, blockWasProcessed: true})
      expect(marker).toMatchObject({block: 11, logIndex: -1, blockWasProcessed: true})

      marker.update({block: 22, logIndex: 4})
    }
    {
      const marker = TrackerMarker.of(store, 21212)
      expect(marker).toMatchObject({block: 0, logIndex: -1, blockWasProcessed: false})

      marker.update({block: 3})
      marker.update({logIndex: 4})
      marker.update({blockWasProcessed: true})
      expect(marker).toMatchObject({block: 3, logIndex: 4, blockWasProcessed: true})

      marker.update({logIndex: 9})
    }
    expect(TrackerMarker.of(store, 10101)).toMatchObject({block: 22, logIndex: 4, blockWasProcessed: true})
    expect(TrackerMarker.of(store, 21212)).toMatchObject({block: 3, logIndex: 9, blockWasProcessed: true})
  })
})
