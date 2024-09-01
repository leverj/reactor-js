import {JsonStore} from '@leverj/common'
import {execSync} from 'child_process'
import {fileURLToPath} from 'url'
import yargs from 'yargs/yargs'


const {keepLogs} = yargs(process.argv.slice(2)).usage('Usage: $0 --keep-logs').argv
const root = fileURLToPath(new URL('..', import.meta.url))
const lockDir = `${root}/.lock`
const storage = new JsonStore(lockDir, 'processes')

if (storage.exists) {
  console.log('🛑 stopping servers ...')
  for (let [name, pid] of storage.entries()) {
    const pids = getAssociatedPids(pid)
    console.log(`${name} @ ${pid} 🧨 killing associated processes [${pids}]`)
    for (const pid of pids) kill(pid)
  }
  execSync('sleep 1') // give killed processes time to die ...
}
execSync(`rm -rf ${keepLogs ? storage.file : lockDir}`)

function kill(pid) {
  try {
    execSync(`kill ${pid}`)
  } catch (e) {
    if (e.message.indexOf('No such process') === -1) throw e
  }
}

function getAssociatedPids(pid) {
  const all = []
  let current = pid
  while (current) {
    all.push(current)
    try {
      current = parseInt(execSync(`pgrep -P ${current}`))
    } catch (e) {
      current = null
    }
  }
  return all
}
