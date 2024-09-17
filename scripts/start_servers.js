import {JsonStore} from '@leverj/common'
import {execSync, spawn} from 'child_process'
import {openSync} from 'node:fs'
import {fileURLToPath} from 'url'
import waitOn from 'wait-on'
import yargs from 'yargs/yargs'

const {localChain} = yargs(process.argv.slice(2)).usage('Usage: $0 --local-chain').argv
const root = fileURLToPath(new URL('..', import.meta.url))
const lockDir = `${root}/.lock`
execSync(`mkdir -p ${lockDir}`)
const storage = new JsonStore(lockDir, 'processes')
const env = process.env.NODE_ENV
if (!env) {
  console.error('💥 !!! must specify a proper NODE_ENV !!!')
  process.exit(2)
} else if (storage.exists) {
  console.error('💥 !!! servers already running; run stop_servers first !!!')
  process.exit(2)
} else await startAllServers()

async function startAllServers() {
  console.log('💫 starting servers ...')
  if (localChain) {
    launch('chain', 'start:local:chain', `${root}/packages/chain`)
    await waitOn({resources: ['http://localhost:8545'], timeout: 5_000}).then(async () => {
      const stdioFile = `${lockDir}/deploy-contracts.log`
      const out = openSync(stdioFile, 'a')
      const err = openSync(stdioFile, 'a')
      execSync(`yarn deploy:local:chain`, {cwd: `${root}/packages/chain`, stdio: ['ignore', out, err]})
    })
  }
}

function launch(name, script, cwd) {
  const stdioFile = `${lockDir}/${name}.log`
  const out = openSync(stdioFile, 'a')
  const err = openSync(stdioFile, 'a')
  const args = Array.isArray(script) ? script : [script]
  const process = spawn('yarn', args, {cwd, detached: true, stdio: ['ignore', out, err]})
  process.unref()
  storage.set(name, process.pid)
  console.log(`🚀 ${name} @ ${process.pid}`)
}
