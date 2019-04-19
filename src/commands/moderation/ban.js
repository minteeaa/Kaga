const { Command } = require('sylphy')
const randomColor = require('randomcolor')

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
    const color = parseInt(randomColor().replace(/#/gi, '0x'))
    const member = args.member
    const purge = args.purge
    const reason = args.reason
    const db = require('quick.db')
    if (!msg.member.permission.has('banMembers')) {
      return responder
        .format(['emoji:negative_squared_check_mark'])
        .send('This requires you to have a role that can ban members.')
    } else if (!member) {
      return responder
        .format(['emoji:negative_squared_check_mark'])
        .send('There was no member specified to ban!')
    } else if (member.id === msg.author.id) {
      return responder
        .format(['emoji:negative_squared_check_mark'])
        .send('Why would you want to ban yourself?')
    } else if (member.id === client.user.id) {
      return responder
        .format(['emoji:negative_squared_check_mark'])
        .send('You tried to ban me, but ultimately failed.')
    } else {
      try {
        await msg.channel.guild.banMember(member.id, purge, reason)
        responder
          .format(['emoji:white_check_mark'])
          .send(`${member.user.username}#${member.user.discriminator} has been banned.`)
        if (msg.guild.channels.get(db.get(`blog_${msg.channel.guild.id}`)) !== undefined) {
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
