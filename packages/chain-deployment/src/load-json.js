import fs from 'fs'

export const loadJson = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)))
