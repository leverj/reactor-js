import {existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs'

export class JsonStore {
  constructor(path, type) {
    this.path = `${path}/${type}`
    this.create()
  }

  location(key) { return `${this.path}/${key}.json` }
  async has(key) { return existsSync(this.location(key)) }
  async get(key, force = false) { return force || await this.has(key) ? JSON.parse(readFileSync(this.location(key)).toString()) : undefined }
  async set(key, value) {
    if (!existsSync(this.path)) mkdirSync(this.path, {recursive: true})
    writeFileSync(this.location(key), JSON.stringify(value, null, 2))
  }
  // update(key, value) { this.set(key, merge(this.get(key, value), value)) } //fixme?
  async create() { if (!existsSync(this.path)) mkdirSync(this.path, {recursive: true}) }
  async destroy() { rmSync(this.path, {recursive: true, force: true}) }
  async clear() { await this.destroy(); await this.create() }
}
