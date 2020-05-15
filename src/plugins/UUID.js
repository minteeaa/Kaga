const { Client: { plugin } } = require('klasa')
module.exports = {
  [plugin] () {
    function uniqueID () {
      function chr4 () { return Math.random().toString(16).slice(-4) }
      return chr4() + chr4() +
    '-' + chr4() +
    '-' + chr4() +
    '-' + chr4() +
    '-' + chr4() + chr4() + chr4()
    }
    this.genUUID = uniqueID
  }
}
