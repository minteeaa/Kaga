const { Listener } = require('discord-akairo')
class CommandLogger extends Listener {
  constructor () {
    super('commandFinished', {
      emitter: 'commandHandler',
      category: 'commandHandler',
      event: 'commandFinished'
    })
  }

  async exec (message, command) {
    this.client.logger.info(`command run | ${message.author.tag} | ${command.id} ${message.util.parsed.content}`)
  }
}
module.exports = CommandLogger
