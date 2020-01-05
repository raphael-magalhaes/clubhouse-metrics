const Stopwatch = require('../infrastructure').Stopwatch

const LOGGING_ENABLED = process.env.LOGGING_ENABLED === 'true'

const Logger = (entry, stopwatchId) => {
  if (!LOGGING_ENABLED) return

  const timePassed = Stopwatch(stopwatchId)
  if (timePassed) {
    console.log(` → ${entry.replace('#{time}', timePassed)}\n`)
  } else console.log(entry)
}

module.exports = Logger
