const { Command } = require('sylphy')

class prefix extends Command {
  constructor (...args) {
    super(...args, {
      name: 'prefix',
      cooldown: 10,
      options: { guildOnly: true },
      usage:
      { name: 'prefix', displayName: 'prefix', type: 'string', optional: false, last: true }
    })
  }

  handle ({ args, client, msg }, responder) {
    const db = require('quick.db')
    db.set(`prefix_${msg.channel.guild.id}`, args.prefix)
    responder
      .format(['emoji:emoji:white_check_mark'])
      .send(`prefix changed to \`${args.prefix}\``)
  }
}

module.exports = prefix
module.exports.help = {
  description: 'Change the server prefix for Reika.',
  usage: 'prefix <prefix>',
  group: 'utility'
}
