const request = require('request-promise-native')

const http = {
  call: async (config, callback) => await request(config, callback)
}

module.exports = http
