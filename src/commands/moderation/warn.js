const { Command } = require('sylphy')
const db = require('quick.db')
const randomColor = require('randomcolor')
const yaml = require('js-yaml')
const fs = require('file-system')
let lang

class warn extends Command {
  constructor (...args) {
    super(...args, {
      name: 'warn',
      aliases: 'strike',
      cooldown: 2,
      options: { guildOnly: true, requirements: { permissions: { manageMessages: true } } },
      usage: [
        { name: 'member', displayName: 'member', type: 'member', optional: true },
        { name: 'reason', displayName: 'reason', type: 'string', optional: true, last: true }
      ]
    })
  }

  async handle ({ args, client, msg }, responder) {
    if (db.get(`serverLang_${msg.channel.guild.id}`) == null) lang = yaml.safeLoad(fs.readFileSync('./src/lang/en_us.yml', 'utf8'))
    const color = parseInt(randomColor().replace(/#/gi, '0x'))
    const member = args.member
    const reason = args.reason
    let user
    if (msg.mentions.length > 0) user = msg.channel.guild.members.get(msg.mentions[0].id)
    if (!msg.member.permission.has('manageMessages')) return responder.send(`${client.deny} ${lang.warnnoperms}`)
    else if (!member) return responder.send(`${client.question} ${lang.warnnospecify}`)
    else if (user.id === msg.author.id) return responder.send(`${client.deny} ${lang.warnself}`)
    else if (user.id === client.user.id) return responder.send(`${client.deny} ${lang.warnbot}`)
    else {
      try {
        await db.add(`${user.id}.history.warns`, 1)
        if (!reason) responder.send(`${client.success} ${lang.warnnoreason.replace('$USER', user.mention)}`)
        else responder.send(`${client.success} ${lang.warnsuccess.replace('$USER', user.mention).replace('$REASON', reason)}`)
      } catch (error) {
        this.logger.error(new Error(error))
        return responder.send(' ', { embed: {
          color: color,
          title: 'Warn Error',
          description: `${error}`,
          timestamp: new Date()
        } })
      }
    }
  }
}

module.exports = warn
module.exports.help = {
  description: 'Warn/strike someone.',
  usage: 'warn <user>',
  group: 'moderation'
}
