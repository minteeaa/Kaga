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
        { name: 'purge', displayName: 'msgPupurgerge', type: 'int', min: 0, max: 7, optional: true },
        { name: 'reason', displayName: 'reason', type: 'string', optional: true, last: true }
      ]
    })
  }

  async handle ({ args, client, msg }, responder) {
    if (db.get(`serverLang_${msg.channel.guild.id}`) == null) lang = yaml.safeLoad(fs.readFileSync('./src/lang/en_us.yml', 'utf8'))
    const color = parseInt(randomColor().replace(/#/gi, '0x'))
    const member = args.member
    const purge = args.purge
    const reason = args.reason
    let user
    if (msg.mentions.length > 0) user = msg.channel.guild.members.get(msg.mentions[0].id)
    if (!msg.member.permission.has('kickMembers')) return responder.send(`${lang.rdeny} ${lang.kicknoperms}`)
    else if (!member) return responder.send(`${lang.rquestion} ${lang.kicknospecify}`)
    else if (!msg.mentions[0]) return responder.send(`${lang.rdeny} ${lang.kicknotvalid}`)
    else if (user.id === msg.author.id) return responder.send(`${lang.rquestion} ${lang.kickself}`)
    else if (user.id === client.user.id) return responder.send(`${lang.rdeny} ${lang.kickbot}`)
    else {
      try {
        await msg.channel.guild.kickMember(user.id, purge, reason)
        responder.send(`${lang.rsuccess} ${lang.kicksuccess.replace('$USER', `**${user.username}#${user.discriminator}**`)}`)
        if (msg.guild.channels.get(db.get(`kickLog_${msg.channel.guild.id}`)) != null) {
          client.createMessage(msg.guild.channels.get(db.get(`kickLog_${msg.channel.guild.id}`)), { embed: {
            color: color,
            title: 'Member Kick',
            thumbnail: { url: member.user.avatarURL },
            fields: [{ name: 'User', value: `${member.user.username}#${member.user.discriminator}` },
              { name: 'ID', value: member.user.id },
              { name: 'Reason', value: `${reason == null ? 'None' : reason}` },
              { name: 'Staff Member', value: msg.author.mention }],
            timestamp: new Date()
          } })
        }
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
