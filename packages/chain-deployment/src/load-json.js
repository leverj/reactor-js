import {readFileSync} from 'node:fs'

export const loadJson = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)))
