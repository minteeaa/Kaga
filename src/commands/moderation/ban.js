const { Command } = require('sylphy')
const db = require('quick.db')
const randomColor = require('randomcolor')
const yaml = require('js-yaml')
const fs = require('fs')
let lang

class ban extends Command {
  constructor (...args) {
    super(...args, {
      name: 'ban',
      cooldown: 2,
      options: { guildOnly: true, requirements: { permissions: { banMembers: true } } },
      usage: [
        { name: 'member', displayName: 'member', type: 'member', optional: true },
        { name: 'purge', displayName: 'msgPupurgerge', type: 'int', min: 0, max: 7, optional: true },
        { name: 'reason', displayName: 'reason', type: 'string', optional: true, last: true }
      ]
    })
  }

  async handle ({ args, client, msg }, responder) {
    if (db.get(`${msg.channel.guild.id}.settings.lang`) == null) lang = yaml.safeLoad(fs.readFileSync('./src/lang/en_us.yml', 'utf8'))
    const color = parseInt(randomColor().replace(/#/gi, '0x'))
    const member = args.member
    const purge = args.purge
    const reason = args.reason
    let user
    if (msg.mentions.length > 0) user = msg.channel.guild.members.get(msg.mentions[0].id)
    if (!msg.member.permission.has('banMembers')) return responder.send(`${client.deny} ${lang.bannoperms}`)
    else if (!member) return responder.send(`${client.question} ${lang.bannospecify}`)
    else if (!msg.mentions[0]) return responder.send(`${client.deny} ${lang.bannotvalid}`)
    else if (user.id === msg.author.id) return responder.send(`${client.question} ${lang.banself}`)
    else if (user.id === client.user.id) return responder.send(`${client.deny} ${lang.banbot}`)
    else {
      try {
        await msg.channel.guild.banMember(user.id, purge, reason)
        responder.send(`${client.success} ${lang.bansuccess.replace('$USER', `**${user.username}#${user.discriminator}**`)}`)
      } catch (error) {
        this.logger.error(new Error(error))
        return responder.send(' ', { embed: {
          color: color,
          title: 'Ban Error',
          description: `${error}`,
          timestamp: new Date()
        } })
      }
    }
  }
}

module.exports = ban
module.exports.help = {
  description: 'ban a user from the server.',
  usage: 'ban <user> [purge messages] [reason]',
  group: 'moderation'
}
