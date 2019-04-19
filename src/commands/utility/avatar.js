const randomColor = require('randomcolor')
const { Command } = require('sylphy')

class avatar extends Command {
  constructor (...args) {
    super(...args, {
      name: 'avatar',
      cooldown: 5,
      options: { guildOnly: true },
      usage: [
        { name: 'options', displayName: 'options', type: 'string', optional: true, last: true }
      ]
    })
  }
  handle ({ args, client, msg }, responder) {
    const color = parseInt(randomColor().replace(/#/gi, '0x'))
    const user = msg.mentions[0] || msg.author
    const embed =
      {
        'embed': {
          'title': 'Source',
          'url': user.avatarURL,
          'color': color,
          'timestamp': new Date(),
          'image': {
            'url': `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=2048`
          },
          'author': {
            'name': user.username + '#' + user.discriminator
          }
        }
      }
    client.createMessage(msg.channel.id, embed)
  }
}

module.exports = avatar
module.exports.help = {
  description: 'Shows a user\'s avatar.',
  usage: 'avatar [user]',
  group: 'utility'
}
