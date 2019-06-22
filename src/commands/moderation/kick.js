const { Command } = require('sylphy')
const db = require('quick.db')
const randomColor = require('randomcolor')
const yaml = require('js-yaml')
const fs = require('fs')
let lang

class kick extends Command {
  constructor (...args) {
    super(...args, {
      name: 'kick',
      cooldown: 2,
      options: { guildOnly: true, requirements: { permissions: { kickMembers: true } } },
      usage: [
        { name: 'member', displayName: 'member', type: 'member', optional: true },
        { name: 'reason', displayName: 'reason', type: 'string', optional: true, last: true }
      ]
    })
  }

  async handle ({ args, client, msg }, responder) {
    if (db.get(`${msg.channel.guild.id}.settings.lang`) == null) lang = yaml.safeLoad(fs.readFileSync('./src/lang/en_us.yml', 'utf8'))
    const color = parseInt(randomColor().replace(/#/gi, '0x'))
    const member = args.member
    const reason = args.reason
    let user
    if (msg.mentions.length > 0) user = msg.channel.guild.members.get(msg.mentions[0].id)
    if (!msg.member.permission.has('kickMembers')) return responder.send(`${client.deny} ${lang.kicknoperms}`)
    else if (!member) return responder.send(`${client.question} ${lang.kicknospecify}`)
    else if (!msg.mentions[0]) return responder.send(`${client.deny} ${lang.kicknotvalid}`)
    else if (user.id === msg.author.id) return responder.send(`${client.question} ${lang.kickself}`)
    else if (user.id === client.user.id) return responder.send(`${client.deny} ${lang.kickbot}`)
    else {
      try {
        await msg.channel.guild.kickMember(user.id, reason)
        responder.send(`${client.success} ${lang.kicksuccess.replace('$USER', `**${user.username}#${user.discriminator}**`)}`)
      } catch (error) {
        this.logger.error(new Error(error))
        return responder.send(' ', { embed: {
          color: color,
          title: 'Kick Error',
          description: `${error}`,
          timestamp: new Date()
        } })
      }
    }
  }
}

module.exports = kick
module.exports.help = {
  description: 'kick a user from the server.',
  usage: 'kick <user> [purge messages] [reason]',
  group: 'moderation'
}
