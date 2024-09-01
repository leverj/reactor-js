import {isEmpty} from 'lodash-es'


export class CapturingLogger {
  constructor(silent = true) {
    this.silent = silent
    this.logs = []
    this.warnings = []
    this.errors = []
  }

  info(...args) { this._exec_(this.logs, console.info, ...args) }
  trace(...args) { this._exec_(this.logs, console.trace, ...args) }
  log(...args) { this._exec_(this.logs, console.log, ...args) }
  warn(...args) { this._exec_(this.warnings, console.warn, ...args) }
  error(e) { this._exec_(this.errors, console.error, `${e.name}: ${e.message}`) }

  _exec_(array, f, ...args) {
    array.push(args.join(', '))
    if (!this.silent) f(...args)
  }

  dump() {
    if (!isEmpty(this.logs)) console.log('logs:\n', this.logs.join('\n'))
    if (!isEmpty(this.warnings)) console.log('warnings:\n', this.warnings.join('\n'))
    if (!isEmpty(this.errors)) console.log('errors:\n', this.errors.map(e => e.message).join('\n'))
  }

  clear() { [this.logs, this.warnings, this.errors].forEach(_ => _.length = 0) }
}
