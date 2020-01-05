const timeReadings = {}

const Stopwatch = id => {
  if (id == null) return

  if (timeReadings[id]) {
    const timePassedInSeconds = (Date.now() - timeReadings[id]) / 1000
    delete timeReadings[id]
    return timePassedInSeconds
  }

  timeReadings[id] = Date.now()
}

module.exports = Stopwatch
