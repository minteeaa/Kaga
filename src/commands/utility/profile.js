const { Command } = require('sylphy')
const db = require('quick.db')
const randomColor = require('randomcolor')

class profile extends Command {
  constructor (...args) {
    super(...args, {
      name: 'profile',
      cooldown: 10,
      options: { guildOnly: true },
      usage: [
        { name: 'user', displayName: 'user', type: 'string', optional: true }
      ]
    })
  }

  async handle ({ args, client, msg }, responder) {
    let sUserLevel
    let sUserXP
    let gUserLevel
    let gUserXP
    let gUserDesc
    const color = parseInt(randomColor().replace(/#/gi, '0x'))
    const user = args.user
    sUserXP = db.fetch(`${msg.channel.guild.id}.profiles.${msg.author.id}.xp`)
    gUserXP = db.fetch(`global.profiles.${msg.author.id}.xp`)
    sUserLevel = db.fetch(
      `${msg.channel.guild.id}.profiles.${msg.author.id}.level`
    )
    gUserLevel = db.fetch(`global.profiles.${msg.author.id}.level`)
    gUserDesc = db.fetch(`global.profiles.${msg.author.id}.desc`)
    if (sUserXP == null) {
      db.set(`${msg.channel.guild.id}.profiles.${msg.author.id}.xp`, 1)
      sUserXP = db.fetch(`${msg.channel.guild.id}.profiles.${msg.author.id}.xp`)
    }
    if (gUserXP == null) {
      db.set(`global.profiles.${msg.author.id}.xp`, 1)
      gUserXP = db.fetch(`global.profiles.${msg.author.id}.xp`)
    }
    if (sUserLevel == null) {
      db.set(`${msg.channel.guild.id}.profiles.${msg.author.id}.level`, 1)
      sUserLevel = db.fetch(
        `${msg.channel.guild.id}.profiles.${msg.author.id}.level`
      )
    }
    if (gUserLevel == null) {
      db.set(`global.profiles.${msg.author.id}.level`, 1)
      gUserLevel = db.fetch(`global.profiles.${msg.author.id}.level`)
    }
    if (gUserDesc == null) {
      db.set(`global.profiles.${msg.author.id}.desc`, 'A Discord user')
      gUserDesc = db.fetch(`global.profiles.${msg.author.id}.desc`)
    }
    if (!user) {
      let embed = {
        embed: {
          color: color,
          timestamp: new Date(),
          description: gUserDesc,
          footer: {
            icon_url: msg.author.avatarURL,
            text: `Requested by ${msg.author.username}`
          },
          author: {
            name: `${msg.author.username}'s Profile`
          },
          thumbnail: {
            url: `${msg.author.avatarURL}`
          },
          fields: [
            {
              name: 'User Information',
              value: `Level: ${sUserLevel} (${sUserXP})`,
              inline: true
            },
            {
              name: 'Global User Information',
              value: `Level: ${gUserLevel} (${gUserXP})`,
              inline: true
            }
          ]
        }
      }
      client.createMessage(msg.channel.id, embed)
    }
  }
}

module.exports = profile
module.exports.help = {
  description: 'Display your profile.',
  usage: 'profile [discord ID | user mention]',
  group: 'utility'
}
