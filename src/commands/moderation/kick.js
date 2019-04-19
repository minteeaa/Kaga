const { Command } = require('sylphy')
const randomColor = require('randomcolor')

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
    const color = parseInt(randomColor().replace(/#/gi, '0x'))
    const member = args.member
    const purge = args.purge
    const reason = args.reason
    const db = require('quick.db')
    if (!msg.member.permission.has('kickMembers')) {
      return responder
        .format(['emoji:negative_squared_check_mark'])
        .send('This requires you to have a role that can kick members.')
    } else if (!member) {
      return responder
        .format(['emoji:negative_squared_check_mark'])
        .send('There was no member specified to kick!')
    } else if (member.id === msg.author.id) {
      return responder
        .format(['emoji:negative_squared_check_mark'])
        .send('Why would you want to kick yourself?')
    } else if (member.id === client.user.id) {
      return responder
        .format(['emoji:negative_squared_check_mark'])
        .send('You tried to kick me, but ultimately failed.')
    } else {
      try {
        await msg.channel.guild.kickMember(member.id, purge, reason)
        responder
          .format(['emoji:white_check_mark'])
          .send(`${member.user.username}#${member.user.discriminator} has been kicked.`)
        if (msg.guild.channels.get(db.get(`klog_${msg.channel.guild.id}`)) !== undefined) {
          responder.send(' ', { embed: {
            color: color,
            title: 'Member Kick',
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
  description: 'Kick a user from the server.',
  usage: 'kick <user>',
  group: 'moderation'
}
