const fs = require('fs')

const fileSystem = {
  save: (data, path) => fs.writeFileSync(path, JSON.stringify(data))
}

module.exports = fileSystem
