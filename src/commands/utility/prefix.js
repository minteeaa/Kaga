const { Command } = require('sylphy')
const yaml = require('js-yaml')
const fs = require('fs')
let lang

class prefix extends Command {
  constructor (...args) {
    super(...args, {
      name: 'prefix',
      cooldown: 10,
      options: { guildOnly: true },
      usage:
      { name: 'prefix', displayName: 'prefix', type: 'string', optional: true, last: true }
    })
  }

  handle ({ args, client, msg }, responder) {
    const db = require('quick.db')
    if (db.get(`serverLang_${msg.channel.guild.id}`) == null) lang = yaml.safeLoad(fs.readFileSync('./src/lang/en_us.yml', 'utf8'))
    if (!args.prefix) return responder.send(`${lang.rquestion} ${lang.prefixnospecify}`)
    else {
      db.set(`prefix_${msg.channel.guild.id}`, args.prefix)
      responder.send(`${lang.rsuccess} ${lang.prefixchanged.replace('$PREFIX', args.prefix)}`)
    }
  }
}

module.exports = prefix
module.exports.help = {
  description: 'Change the server prefix for Reika.',
  usage: 'prefix <prefix>',
  group: 'utility'
}
