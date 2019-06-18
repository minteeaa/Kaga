const { Command } = require('sylphy')
const db = require('quick.db')
const randomColor = require('randomcolor')
const yaml = require('js-yaml')
const fs = require('fs')
let lang

class purge extends Command {
  constructor (...args) {
    super(...args, {
      name: 'purge',
      cooldown: 10,
      options: { guildOnly: true, requirements: { permissions: { manageMessages: true } } },
      usage: [
        { name: 'amount', displayName: 'amount', type: 'int', optional: true }
      ]
    })
  }

  async handle ({ args, client, msg }, responder) {
    const color = parseInt(randomColor().replace(/#/gi, '0x'))
    if (db.get(`serverLang_${msg.channel.guild.id}`) == null) lang = yaml.safeLoad(fs.readFileSync('./src/lang/en_us.yml', 'utf8'))
    const purge = args.amount
    if (!msg.member.permission.has('manageMessages')) return responder.send(`${lang.rdeny} ${lang.purgenoperms}`)
    else if (!purge) return responder.send(`${lang.rquestion} ${lang.purgenoamount}`)
    else if (purge > 100) return responder.send(`${lang.rdeny} ${lang.purgemax}`)
    else {
      try {
        client.deleteMessage(msg.channel.id, msg.id)
        await client.getMessages(msg.channel.id, purge)
          .then(messages => {
            let msgA = []
            for (let x = 0; x < messages.length; x++) {
              msgA.push(messages[x].id)
            }
            responder
              .format(['emoji:speech_balloon'])
              .send(`${lang.purgeworking}`)
              .then(mess => client.deleteMessage(msg.channel.id, mess.id))
            client.deleteMessages(msg.channel.id, msgA)
          })
      } catch (error) {
        this.logger.error(new Error(error))
        return responder.send(' ', { embed: {
          color: color,
          title: 'Purge Error',
          description: `${error}`,
          timestamp: new Date()
        } })
      }
    }
  }
}

module.exports = purge
module.exports.help = {
  description: 'Purge messages.',
  usage: 'purge <amount>',
  group: 'moderation'
}
