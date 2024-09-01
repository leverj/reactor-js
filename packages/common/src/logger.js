const now = () => new Date().toISOString()

const none = {
  info: () => {},
  trace: () => {},
  log: () => {},
  warn: () => {},
  error: () => {},
  time: () => {},
}
const LOGGER = typeof process !== 'undefined' && process.env.SILENCE ? none : console

export const logger = {
  info: (...args) => LOGGER.info(now(), ...args),
  trace: (...args) => LOGGER.trace(now(), ...args),
  log: (...args) => LOGGER.log(now(), ...args),
  warn: (...args) => LOGGER.warn(now(), ...args),
  error: (...args) => LOGGER.error(now(), ...args),
  table: (...args) => LOGGER.table(...args),
  time: (...args) => {
    const start = Date.now()
    return {
      execute: async (promise) => {
        const result = await promise
        const now = Date.now()
        if (now - start > 1) LOGGER.log(`[${now - start} millis] : (PERF timing info @ ${now}) -`, ...args)
        return result
      }
    }
  }
}
