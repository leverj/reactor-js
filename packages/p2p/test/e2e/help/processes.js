import {setTimeout} from 'node:timers/promises'

export async function killAll(processes) {
  for (let each of processes) {
    each.kill()
    while(!each.killed) await setTimeout(10)
  }
}
