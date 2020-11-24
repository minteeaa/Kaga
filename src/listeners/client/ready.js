const { Listener } = require('discord-akairo')
class ReadyListener extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready',
      category: 'client'
    })
  }

  async exec () {
    this.client.logger.info(`Logged in as ${this.client.user.tag}`, 'ready')
    this.client.user.setActivity('Kaga v0.0.1', { type: 'PLAYING' })
  }
}
module.exports = ReadyListener
