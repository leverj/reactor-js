import {existsSync, mkdirSync} from 'node:fs'

export const ensureExistsSync = (path) => { if (!existsSync(path)) mkdirSync(path, {recursive: true}) }
