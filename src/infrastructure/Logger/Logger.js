const Stopwatch = require('./Stopwatch/Stopwatch')

const Logger = (entry, stopwatchId) => {
  if (process.env.LOGGING_ENABLED !== 'true') return

  const timePassed = Stopwatch(stopwatchId)
  if (timePassed) {
    console.log(` → ${entry.replace('#{time}', timePassed)}\n`)
  } else console.log(entry)
}

module.exports = Logger
