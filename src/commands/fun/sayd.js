const { Command } = require('sylphy')

class sayd extends Command {
  constructor (...args) {
    super(...args, {
      name: 'sayd',
      cooldown: 3,
      options: { guildOnly: true },
      usage: [
        { name: 'text', displayName: 'text', type: 'string', optional: false, last: true }
      ]
    })
  }
  handle ({ args, client, msg }, responder) {
    responder.typing()
    responder.send(args.text)
    msg.delete(msg.author)
  }
}

module.exports = sayd
module.exports.help = {
  description: 'The bot said it.',
  usage: 'sayd <text>',
  group: 'fun'
}
