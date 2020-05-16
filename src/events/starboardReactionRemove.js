const { Event } = require('klasa')
const db = require('quick.db')
const emoji = require('node-emoji')

module.exports = class extends Event {
  constructor (...args) {
    super(...args, {
      name: 'starboardReactionRemove',
      enabled: true,
      event: 'messageReactionRemove',
      once: false
    })
  }

  async run (message, reaction) {
    try {
      const emote = db.fetch(`${message.channel.guild.id}.starboard.settings.emoji`)
      const msg = await message.channel.getMessage(message.id)
      if ((reaction.id == null && emoji.unemojify(reaction.name) === `:${emote}:`) || (reaction.id != null && `<:${reaction.name}:${reaction.id}>` === emote)) {
        db.subtract(`${message.channel.guild.id}.starboard.count.${message.id}`, 1)
        const c = db.fetch(`${message.channel.guild.id}.starboard.count.${message.id}`)
        const min = db.fetch(`${message.channel.guild.id}.starboard.settings.minimum`)
        const starMsg = db.fetch(`${message.channel.guild.id}.starboard.posted.${message.id}`)
        const starChannel = await message.channel.guild.channels.get(db.fetch(`${message.channel.guild.id}.starboard.settings.channel`))
        if (starMsg == null) return
        const starBMsg = await starChannel.getMessage(starMsg)
        try {
          if (starMsg != null && c < min) {
            starChannel.deleteMessage(starBMsg.id)
            return db.delete(`${message.channel.guild.id}.starboard.posted.${message.id}`)
          } else if (starMsg != null && c >= min) return await this._client.editMessage(starBMsg, await populateEmbed(message, msg))
        } catch (e) {
          this.logger.error(e)
        }
      }
    } catch (e) {
      this.logger.error(e)
    }
  }
}

const embed = {
  embed: {}
}

async function populateEmbed (message, msg) {
  let image
  const emote = db.fetch(`${message.channel.guild.id}.starboard.settings.emoji`)
  const min = db.fetch(`${msg.channel.guild.id}.starboard.settings.minimal`)
  const c = db.fetch(`${message.channel.guild.id}.starboard.count.${message.id}`)
  if (msg.attachments[0] != null) {
    const imageLink = msg.attachments[0].url.split('.')
    const typeOfImage = imageLink[imageLink.length - 1]
    const im = /(jpg|jpeg|png|gif)/gi.test(typeOfImage)
    if (!im) image = ''
    else image = msg.attachments[0].url
  }
  if (min === true) {
    embed.embed.color = 0xFFC300
    embed.embed.title = `${c} ${emote}`
    embed.embed.timestamp = new Date()
    embed.embed.footer = { icon_url: msg.author.avatarURL, text: `${msg.author.username} in #${msg.channel.name}` }
    embed.embed.image = { url: image }
    if (msg.content !== '') embed.embed.description = msg.content
  } else if (min === false) {
    embed.embed.color = 0xFFC300
    embed.embed.title = `${c} ${emote}`
    embed.embed.timestamp = new Date()
    embed.embed.footer = { text: msg.id }
    embed.embed.thumbnail = { url: msg.author.avatarURL }
    embed.embed.image = { url: image }
    embed.embed.fields = [
      { name: 'Author', value: msg.author.mention, inline: true },
      { name: 'Channel', value: msg.channel.mention, inline: true },
      { name: 'Jump to message', value: `[Jump](https://discordapp.com/channels/${message.channel.guild.id}/${msg.channel.id}/${msg.id})`, inline: true }
    ]
    if (msg.content !== '') {
      embed.embed.fields.push({
        name: 'Content',
        value: msg.content,
        inline: true
      })
    }
  }
  return embed
}
