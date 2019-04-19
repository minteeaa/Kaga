const { Command } = require('sylphy')

class ping extends Command {
  constructor (...args) {
    super(...args, {
      name: 'ping',
      cooldown: 10,
      options: { guildOnly: true }
    })
  }

  handle ({ client, msg }, responder) {
    return responder.send(`${msg.author.mention} | Pong! - Took **${msg.channel.guild.shard.latency} ms**`)
  }
}

module.exports = ping
module.exports.help = {
  description: 'Pong.',
  usage: 'ping',
  group: 'utility'
}
