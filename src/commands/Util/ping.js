const { Command } = require('discord-akairo')
class Ping extends Command {
  constructor () {
    super('ping', {
      aliases: ['ping', 'hello']
    })
  }

  async exec (message) {
    const sent = await message.channel.send(this.client.lang.getLocale('en-US', 'ping', 'pong'))
    const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt)
    sent.edit(this.client.lang.getLocale('en-US', 'ping', 'pongEdit').replace('$1', timeDiff).replace('$2', Math.round(this.client.ws.ping)))
  }
}
module.exports = Ping
module.exports.ping = {
  description: 'Pong!',
  usage: 'ping',
  group: 'utility'
}
