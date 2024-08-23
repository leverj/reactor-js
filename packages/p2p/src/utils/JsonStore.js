import {existsSync, mkdirSync, readFileSync, rmSync, rmdirSync, writeFileSync} from 'node:fs'

export class JsonStore {
  constructor(path, type) {
    this.path = `${path}/${type}`
    this.create()
  }
  file(key) { return `${this.path}/${key}.json` }
  get(key) { return existsSync(this.file(key)) ? JSON.parse(readFileSync(this.file(key)).toString()) : undefined }
  set(key, value) { writeFileSync(this.file(key), JSON.stringify(value, null, 2)) }
  delete(key) { if (existsSync(this.file(key))) rmSync(this.file(key), {force: true}) }
  create() {  if (!existsSync(this.path)) mkdirSync(this.path, {recursive: true}) }
  destroy() { rmSync(this.path, {recursive: true, force: true}) }
  clean() { this.destroy(); this.create() }
}
