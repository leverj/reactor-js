export const until = async (predicate, interval, timeout) => {
  const start = Date.now()
  const poll = async (done) => {
    if (Date.now() - start > timeout) return done(null)
    const value = await predicate()
    return value ? done(value) : setTimeout(() => poll(done), interval)
  }
  return new Promise(poll)
}
