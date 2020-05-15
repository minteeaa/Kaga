const { Command } = require('klasa')
const randomColor = require('randomcolor')
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (...args) {
    super(...args, {
      description: language => language.get('COMMAND_AVATAR_DESCRIPTION'),
      usage: '[user:user]'
    })
  }

  async run (message, [user = message.author]) {
    const color = parseInt(randomColor().replace(/#/gi, '0x'))
    const avatar = user.displayAvatarURL({ size: 512 })

    return message.sendEmbed(new MessageEmbed()
      .setColor(color)
      .setAuthor(user.username, avatar)
      .setImage(avatar))
  }
}
