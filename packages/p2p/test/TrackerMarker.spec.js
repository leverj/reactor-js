import {expect} from 'expect'
import {rmdirSync} from 'node:fs'
import {TrackerMarker} from '../src/TransferTracker.js'

const dataDir = `${process.cwd()}/../../data`

describe('TrackerMarker', () => {
  afterEach(() => rmdirSync(dataDir, {recursive: true, force: true}))

  it('can get and update a marker', () => {
    {
      const marker = TrackerMarker.of(dataDir, 10101)
      expect(marker).toMatchObject({block: 0, logIndex: -1, blockWasProcessed: false})

      marker.update({block: 11, blockWasProcessed: true})
      expect(marker).toMatchObject({block: 11, logIndex: -1, blockWasProcessed: true})

      marker.update({block: 22, logIndex: 4})
    }
    {
      const marker = TrackerMarker.of(dataDir, 21212)
      expect(marker).toMatchObject({block: 0, logIndex: -1, blockWasProcessed: false})

      marker.update({block: 3})
      marker.update({logIndex: 4})
      marker.update({blockWasProcessed: true})
      expect(marker).toMatchObject({block: 3, logIndex: 4, blockWasProcessed: true})

      marker.update({logIndex: 9})
    }
    expect(TrackerMarker.of(dataDir, 10101)).toMatchObject({block: 22, logIndex: 4, blockWasProcessed: true})
    expect(TrackerMarker.of(dataDir, 21212)).toMatchObject({block: 3, logIndex: 9, blockWasProcessed: true})
  })
})
