const { Command } = require('discord-akairo')
const fs = require('file-system')
const readdirp = require('readdirp')

class Help extends Command {
  constructor () {
    super('help', {
      aliases: ['help'],
      args: [
        {
          id: 'cmd',
          type: 'string',
          default: null
        }
      ]
    })
  }

  exec (message, args) {
    const allFilePaths = []
    const embed = {
      embed: {
        timestamp: new Date(),
        footer: {
          icon_url: message.author.avatarURL,
          text: `Requested by ${message.author.username}`
        },
        author: {
          name: `${this.client.user.username}'s commands`,
          url: 'https://mintea.pw/',
          icon_url: this.client.user.avatarURL
        },
        fields: [
        ]
      }
    }
    const command = args.cmd
    const groups = []
    if (!command) {
      fs.readdirSync('./src/commands').forEach(file => {
        groups.push(file)
      })
      for (let i = 0; i < groups.length; i++) {
        const cmds = []
        fs.readdirSync(`./src/commands/${groups[i]}`).forEach(file => {
          cmds.push(file)
        })
        embed.embed.fields.push({ name: groups[i].toUpperCase(), value: cmds.toString().replace(/.js/gi, '').replace(/,/gi, ', ') })
      }
      message.channel.send(embed)
    } else {
      const cm = command.toLowerCase()

      console.log(cm)
      readdirp('./src/commands', { entryType: 'files', fileFilter: `${cm}.js` })
        .on('data', (entry) => {
          const { fullPath } = entry
          allFilePaths.push(fullPath)
        })
        .on('end', () => {
          if (allFilePaths.toString().includes(`${cm}.js`) === true) {
            const cmad = require(allFilePaths.toString())
            embed.embed.author.name = cm + ' command documentation'
            embed.embed.fields.push({ name: 'GROUP', value: cmad[cm].group })
            embed.embed.fields.push({ name: 'DESCRIPTION', value: cmad[cm].description })
            embed.embed.fields.push({ name: 'USAGE', value: '`' + cmad[cm].usage + '`' })
            message.channel.send(embed)
          } else {
            message.channel.send('That command does not exist!')
          }
        })
    }
  }
}
module.exports = Help
module.exports.help = {
  description: 'Send help.',
  usage: 'help [command]',
  group: 'utility'
}
