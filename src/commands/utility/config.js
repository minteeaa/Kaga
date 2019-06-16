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
        { name: 'category', displayName: 'category', type: 'string', optional: true },
        { name: 'option', displayName: 'option', type: 'string', optional: true },
        { name: 'params', displayName: 'params', type: 'string', optional: true }
      ]
    })
  }
  handle ({ args, client, msg }, responder) {
    const logtypes = [
      'kick',
      'ban'
    ]
    const color = parseInt(randomColor().replace(/#/gi, '0x'))
    const category = args.category
    let params = args.params
    const option = args.option
    let kickLog
    if (db.get(`kicklog_${msg.channel.guild.id}`) === null) kickLog = 'None'
    else kickLog = `<#${db.get(`kicklog_${msg.channel.guild.id}`)}>`
    let banLog
    if (db.get(`banlog_${msg.channel.guild.id}`) === null) banLog = 'None'
    else banLog = `<#${db.get(`banlog_${msg.channel.guild.id}`)}>`
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
    if (!category) client.createMessage(msg.channel.id, embed)
    if (category === 'logs') {
      if (!option) {
        client.createMessage(msg.channel.id, embed)
      } else if (logtypes.includes(option)) {
        params = msg.channelMentions
        console.log(category + ' ' + option + ' ' + params)
        if (!params) {
          return responder
            .format(['emoji:negative_squared_check_mark'])
            .send('No valid input detected!')
        } else if (params !== undefined) {
          params = msg.channelMentions[0]
          db.set(`${option}log_${msg.channel.guild.id}`, params)
          responder
            .format(['emoji:emoji:white_check_mark'])
            .send(`${option} log set to <#${params}>`)
        }
      }
    }
  }
}

module.exports = config
module.exports.help = {
  description: 'edit/view the config for the server.',
  usage: 'config [args]',
  group: 'utility'
}
