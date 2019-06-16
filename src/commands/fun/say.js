const { Command } = require('sylphy')

class say extends Command {
  constructor (...args) {
    super(...args, {
      name: 'say',
      cooldown: 3,
      options: { guildOnly: true },
      usage: [
        { name: 'text', displayName: 'text', type: 'string', optional: false, last: true }
      ]
    })
  }
  handle ({ args, client, msg }, responder) {
    responder.send(args.text)
  }
}

module.exports = say
module.exports.help = {
  description: 'Make Reika say something.',
  usage: 'say <text>',
  group: 'fun'
}
