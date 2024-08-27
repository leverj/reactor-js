import {expect} from 'expect'

export class InMemoryStore {
  constructor() { this.map = new Map() }
  get(key, defaults) { return this.map.get(key) || defaults }
  set(key, value) {this.map.set(key, value) }
  clear() { this.map.clear() }
}

export function expectEventsToBe(events, expected) {
  for (let [i, {address, name, args}] of events.entries()) {
    expect(address).toEqual(expected[i].address)
    expect(name).toEqual(expected[i].name)
    expect(args).toMatchObject(expected[i].args)
  }
}
