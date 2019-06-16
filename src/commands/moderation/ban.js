const { Command } = require('sylphy')
const randomColor = require('randomcolor')
const yaml = require('js-yaml')
const fs = require('fs')
const lang = yaml.safeLoad(fs.readFileSync('./src/lang/en_us.yml', 'utf8'))

class ban extends Command {
  constructor (...args) {
    super(...args, {
      name: 'ban',
      cooldown: 2,
      options: { guildOnly: true, requirements: { permissions: { banMembers: true } } },
      usage: [
        { name: 'member', displayName: 'member', type: 'string', optional: true, last: true },
        { name: 'purge', displayName: 'msgPupurgerge', type: 'int', min: 0, max: 7, optional: true },
        { name: 'reason', displayName: 'reason', type: 'string', optional: true, last: true }
      ]
    })
  }

  async handle ({ args, client, msg }, responder) {
    const color = parseInt(randomColor().replace(/#/gi, '0x'))
    const member = args.member
    const purge = args.purge
    const reason = args.reason
    let user
    if (msg.mentions.length > 0) user = msg.channel.guild.members.get(msg.mentions[0].id)
    const db = require('quick.db')
    if (!msg.member.permission.has('banMembers')) return responder.send(`${lang.rdeny} ${lang.bannoperms}`)
    else if (!member) return responder.send(`${lang.rquestion} ${lang.bannospecify}`)
    else if (!msg.mentions[0]) return responder.send(`${lang.deny} ${lang.bannotvalid}`)
    else if (user.id === msg.author.id) return responder.send(`${lang.rquestion} ${lang.bannospecify}`)
    else if (user.id === client.user.id) return responder.send(`${lang.deny} ${lang.banbot}`)
    else {
      try {
        await msg.channel.guild.banMember(user.id, purge, reason)
        responder.send(`${lang.rsuccess} ${lang.bansuccess.replace('$USER', `**${user.username}#${user.discriminator}**`)}`)
        if (msg.guild.channels.get(db.get(`banlog_${msg.channel.guild.id}`)) !== undefined) {
          responder.send(' ', { embed: {
            color: color,
            title: 'Member Ban',
            thumbnail: {
              url: member.user.avatarURL
            },
            fields: [{
              name: 'User',
              value: `${member.user.username}#${member.user.discriminator}`
            },
            {
              name: 'ID',
              value: member.user.id
            },
            {
              name: 'Reason',
              value: `${reason === null ? 'None' : reason}`
            },
            {
              name: 'Staff Member',
              value: msg.author.mention
            }],
            timestamp: new Date()
          } })
        }
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
  usage: 'ban <user>',
  group: 'moderation'
}
