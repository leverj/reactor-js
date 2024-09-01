import {execSync, spawn} from 'child_process'
import {existsSync, openSync, writeFileSync} from 'node:fs'
import {fileURLToPath} from 'url'
import waitOn from 'wait-on'
import yargs from 'yargs/yargs'

const {localChain, reset} = yargs(process.argv.slice(2)).usage('Usage: $0 --local-chain --reset').argv
const root = fileURLToPath(new URL('..', import.meta.url))
const lockDir = `${root}/.lock`
const lockFile = `${lockDir}/processes.json`
const processes = {}
const env = process.env.NODE_ENV
if (!env) {
  console.error('💥 !!! must specify a proper NODE_ENV !!!')
  process.exit(2)
} else if (existsSync(lockFile)) {
  console.error('💥 !!! servers already running; run stop_servers first !!!')
  process.exit(2)
} else await startAllServers()

async function startAllServers() {
  console.log('💫 starting servers ...')
  execSync(`mkdir -p ${lockDir}`)
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
  processes[name] = process.pid
  writeFileSync(lockFile, JSON.stringify(processes, null, 2))
  console.log(`🚀 ${name} @ ${process.pid}`)
}
