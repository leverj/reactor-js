export class InMemoryStore {
  constructor() { this.map = new Map() }
  get(key, defaults) { return this.map.get(key) || defaults }
  set(key, value) {this.map.set(key, value) }
  clear() { this.map.clear() }
}
