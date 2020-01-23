const { Module } = require('sylphy')

class xpHandler extends Module {
  constructor (...args) {
    super(...args, {
      name: 'xp:handler',
      events: {
        messageCreate: 'onMsg'
      }
    })
  }

  async onMsg (message, user) {
    try {
      console.log(message)
    } catch (e) {
      this.logger.error(e)
    }
  }
}

module.exports = xpHandler
