const { Command, util: { isFunction } } = require('klasa')
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (...args) {
    super(...args, {
      aliases: ['commands', 'cmd', 'cmds'],
      guarded: true,
      description: (language) => language.get('COMMAND_HELP_DESCRIPTION'),
      usage: '(Command:command)'
    })

    this.createCustomResolver('command', (arg, possible, message) => {
      if (!arg || arg === '') return undefined
      return this.client.arguments.get('command').run(arg, possible, message)
    })

    // Cache the handlers
    this.handlers = new Map()
  }

  async run (message, [command]) {
    if (command) {
      return message.sendMessage(new MessageEmbed()
        .setTitle(command.name)
        .addField(message.language.get('COMMAND_HELP_EXTENDED'), isFunction(command.extendedHelp) ? command.extendedHelp(message.language) : command.extendedHelp)
        .addField(message.language.get('COMMAND_HELP_USAGE'), command.usage.fullUsage(message))
        .setDescription(isFunction(command.description) ? command.description(message.language) : command.description)
      )
    }

    await message.channel.send(await this.buildDisplay(message))
  }

  async buildDisplay (message) {
    const commands = await this._fetchCommands(message)
    const { prefix } = message.guildSettings
    const display = new MessageEmbed()
    const color = message.member.displayColor
    display.setColor(color)
    display.setTitle(`${this.client.user.username}'s commands`)
    for (const [category, list] of commands) {
      display.addField(`${category.toUpperCase()}`, list.map(this.formatCommand.bind(this, message, prefix, true)).join(', '))
    }

    return display
  }

  formatCommand (message, prefix, richDisplay, command) {
    return richDisplay ? `${command.name}` : `**${command.name}**`
  }

  async _fetchCommands (message) {
    const run = this.client.inhibitors.run.bind(this.client.inhibitors, message)
    const commands = new Map()
    await Promise.all(this.client.commands.map((command) => run(command, true)
      .then(() => {
        const category = commands.get(command.category)
        if (category) category.push(command)
        else commands.set(command.category, [command])
      }).catch(() => {
        // noop
      })
    ))

    return commands
  }
}
