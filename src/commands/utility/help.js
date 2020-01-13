const { Command } = require('sylphy')
const fs = require('file-system')
const readdirp = require('readdirp')

class help extends Command {
  constructor(...args) {
    super(...args, {
      name: 'help',
      cooldown: 5,
      options: { guildOnly: true },
      usage: [
        { name: 'command', displayName: 'command', type: 'string', optional: true, last: true }
      ]
    })
  }

  async handle({ args, client, msg }, responder) {
    const allFilePaths = []
    const embed = {
      'embed': {
        'color': client.normalColor,
        'timestamp': new Date(),
        'footer': {
          'icon_url': msg.author.avatarURL,
          'text': `Requested by ${msg.author.username}`
        },
        'author': {
          'name': `${client.user.username}'s commands`,
          'url': 'https://docs.zetari.xyz/chiya/info',
          'icon_url': client.user.avatarURL
        },
        'fields': [
        ]
      }
    }
    const command = args.command
    let groups = []
    if (!command) {
      fs.readdirSync('./src/commands').forEach(file => {
        groups.push(file)
      })
      for (let i = 0; i < groups.length; i++) {
        let cmds = []
        fs.readdirSync(`./src/commands/${groups[i]}`).forEach(file => {
          cmds.push(file)
        })
        embed.embed.fields.push({ name: groups[i].toUpperCase(), value: cmds.toString().replace(/.js/gi, '').replace(/,/gi, ', ') })
      }
      client.createMessage(msg.channel.id, embed)
    } else {
      await readdirp('./src/commands', { fileFilter: `${command}.js`, type: 'files' })
        .on('data', async (entry) => {
          const { path, stats: { size } } = entry
          console.log(`${JSON.stringify({ path, size })}`)
          console.log(path.toString().includes(`${command}.js`))
          if (path.toString().includes(`${command}.js`) === true) {
            const cmd = require(`./src/commands/${path}`)
            embed.embed.author.name = command + ' command documentation'
            embed.embed.fields.push({ name: 'GROUP', value: cmd.help.group })
            embed.embed.fields.push({ name: 'DESCRIPTION', value: cmd.help.description })
            embed.embed.fields.push({ name: 'USAGE', value: '`' + cmd.help.usage + '`' })
            client.createMessage(msg.channel.id, embed)
          } else {
            responder.error('that command does not exist!')
          }
        })
    }
  }
}
module.exports = help
module.exports.help = {
  description: 'Send help.',
  usage: 'help [command]',
  group: 'utility'
}
