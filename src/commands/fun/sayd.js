const { Command } = require('sylphy')
const db = require('quick.db')
const yaml = require('js-yaml')
const fs = require('file-system')
let lang

class sayd extends Command {
  constructor (...args) {
    super(...args, {
      name: 'sayd',
      cooldown: 3,
      options: { guildOnly: true },
      usage: [
        { name: 'text', displayName: 'text', type: 'string', optional: true, last: true }
      ]
    })
  }
  handle ({ args, client, msg }, responder) {
    if (db.get(`${msg.channel.guild.id}.settings.lang`) == null) lang = yaml.safeLoad(fs.readFileSync('./src/lang/en_us.yml', 'utf8'))
    if (!args.text) return responder.send(`${client.question} ${lang.say[Math.floor(Math.random() * lang.say.length)]}`)
    else {
      responder.send(args.text)
      msg.delete(msg.author)
    }
  }
}

module.exports = sayd
module.exports.help = {
  description: 'The bot said it.',
  usage: 'sayd <text>',
  group: 'fun'
}