export class Mutex {
  constructor() {
    this.busy = false
    this.queue = []
  }

  synchronize(task) {
    const self = this
    return new Promise((resolve, reject) => {
      self.queue.push({task, resolve, reject})
      if (!self.busy) self._dequeue()
    })
  }

  _dequeue() {
    this.busy = true
    const next = this.queue.shift()
    next ? this._execute(next) : this.busy = false
  }

 // revisit: what happens if any of the task throws error?
  _execute(record) {
    const {task, resolve, reject}  = record, self = this
    task().then(resolve, reject).then(() => self._dequeue())
  }
}
