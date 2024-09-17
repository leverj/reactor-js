console.timing = (label) => {
  console.time(label)
  return {
    execute: async (promise) => await promise.then(result => {
      console.timeEnd(label)
      return result
    })
  }
}

const none = {
  trace: () => {},
  debug: () => {},
  info: () => {},
  log: () => {},
  warn: () => {},
  error: () => {},
  table: () => {},
  timing: () => ({execute: async (promise) => await promise}),
}

const LOGGER = typeof process !== 'undefined' && process.env.SILENCE ? none : console

const now = () => new Date().toISOString()

export const logger = {
  trace: (...args) => LOGGER.trace(now(), ...args),
  debug: (...args) => LOGGER.debug(now(), ...args),
  info: (...args) => LOGGER.info(now(), ...args),
  log: (...args) => LOGGER.log(now(), ...args),
  warn: (...args) => LOGGER.warn(now(), ...args),
  error: (...args) => LOGGER.error(now(), ...args),
  table: (...args) => LOGGER.table(now(), ...args),
  timing: (...args) => LOGGER.timing(now(), ...args),
}

export class CapturingLogger {
  constructor(silent = true) {
    this.logger = silent ? none : console
    this.traces = []
    this.debugs = []
    this.infos = []
    this.logs = []
    this.warnings = []
    this.errors = []
    this.tables = []
    this.timings = []
  }

  trace(...args) { this._exec_(this.traces, this.logger.trace, ...args) }
  debug(...args) { this._exec_(this.debugs, this.logger.debug, ...args) }
  info(...args) { this._exec_(this.infos, this.logger.info, ...args) }
  log(...args) { this._exec_(this.logs, this.logger.log, ...args) }
  warn(...args) { this._exec_(this.warnings, this.logger.warn, ...args) }
  error(...args) { const e = args.shift(); this._exec_(this.errors, this.logger.error, `${e.name}: ${e.message}`, ...args)}
  table(...args) { this._exec_(this.tables, this.logger.table, ...args) }
  timing(...args) { this._exec_(this.timings, this.logger.timing, ...args) }

  _exec_(array, f, ...args) {
    array.push(args.join(', '))
    f(...args)
  }

  toObject() {
    return {
      traces: this.traces,
      debugs: this.debugs,
      infos: this.infos,
      logs: this.logs,
      warnings: this.warnings,
      errors: this.errors,
      tables: this.tables,
      timings: this.timings,
    }
  }

  clear() {
    [
      this.traces,
      this.debugs,
      this.infos,
      this.logs,
      this.warnings,
      this.errors,
      this.tables,
      this.timings,
    ].forEach(_ => _.length = 0)
  }
}
