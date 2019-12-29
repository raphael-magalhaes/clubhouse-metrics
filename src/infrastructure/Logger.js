const LOGGING_ENABLED = true

const Logger = entry => {
  LOGGING_ENABLED && console.log(entry)
}

module.exports = Logger
