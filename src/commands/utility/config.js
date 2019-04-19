const { Command } = require('sylphy')
const randomColor = require('randomcolor')
const db = require('quick.db')

class config extends Command {
  constructor (...args) {
    super(...args, {
      name: 'config',
      cooldown: 2,
      options: { guildOnly: true, requirements: { permissions: { administrator: true } } },
      usage: [
        { name: 'member', displayName: 'member', type: 'member', optional: true }
      ]
    })
  }
  handle ({ args, client, msg }, responder) {
    const color = parseInt(randomColor().replace(/#/gi, '0x'))
    let kickLog
    if (db.get(`klog_${msg.channel.guild.id}`) === null) kickLog = 'None'
    else kickLog = `<#${db.get(`klog_${msg.channel.guild.id}`)}>`
    let banLog
    if (db.get(`blog_${msg.channel.guild.id}`) === null) banLog = 'None'
    else banLog = `<#${db.get(`blog_${msg.channel.guild.id}`)}>`
    const embed = {
      'embed': {
        'color': color,
        'timestamp': new Date(),
        'footer': {
          'icon_url': msg.author.avatarURL,
          'text': `Requested by ${msg.author.username}`
        },
        'author': {
          'name': `${msg.channel.guild.name}'s config`
        },
        'fields': [
          {
            'name': 'Kick Log',
            'value': kickLog
          },
          {
            'name': 'Ban Log',
            'value': banLog
          }
        ]
      }
    }
    client.createMessage(msg.channel.id, embed)
  }
}

module.exports = config
module.exports.help = {
  description: 'edit/view the config for the server.',
  usage: 'config [args]',
  group: 'utility'
}
