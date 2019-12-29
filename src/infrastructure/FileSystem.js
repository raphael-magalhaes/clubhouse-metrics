const fs = require('fs')
const csvStringify = require('csv-stringify')

const FileSystem = {
  saveAsJSON: (data, path) => fs.writeFileSync(path, JSON.stringify(data, null, 4)),
  saveAsCSV: (data, path, config) => csvStringify(data, config, (error, output) => fs.writeFileSync(path, output))
}

module.exports = FileSystem
