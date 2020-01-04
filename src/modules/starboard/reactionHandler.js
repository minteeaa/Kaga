const {
  Module
} = require('sylphy')
const db = require('quick.db')
const emoji = require('node-emoji')

class reactionHandler extends Module {
  constructor (...args) {
    super(...args, {
      name: 'starboard:reactions',
      events: {
        messageReactionAdd: 'onReactAdd',
        messageReactionRemove: 'onReactRem'
      }
    })
  }

  async onReactAdd (message, reaction, user) {
    try {
      const msg = await message.channel.getMessage(message.id)
      const emote = db.fetch(`${message.channel.guild.id}.starboard.settings.emoji`)
      const selfStar = db.fetch(`${message.channel.guild}.starboard.settings.selfstar`)
      const botStar = db.fetch(`${message.channel.guild}.starboard.settings.selfstar`)
      const min = db.fetch(`${message.channel.guild.id}.starboard.settings.minimum`)
      const cha = db.fetch(`${message.channel.guild.id}.starboard.settings.channel`)
      const posted = db.fetch(`${message.channel.guild.id}.starboard.posted.${message.id}`)
      const listMode = db.fetch(`${message.channel.guild.id}.starboard.settings.blockmode.type`)
      const listList = db.fetch(`${message.channel.guild.id}.starboard.settings.blockmode.userlist`)
      if (cha === 'None') return
      if (message.channel.id === cha) return
      if (listList != null) {
        if (listMode === 'blacklist' && listList.includes(message.author.id)) return
        if (listMode === 'whitelist' && listList.includes(message.author.id) === false) return
      }
      if ((reaction.id == null && emoji.unemojify(reaction.name) === `:${emote}:`) || (reaction.id != null && `<:${reaction.name}:${reaction.id}>` === emote)) {
        if (selfStar === false && message.author.id === user) return
        if (botStar === false && message.author.id === this._client.id) return
        db.add(`${message.channel.guild.id}.starboard.count.${message.id}`, 1)
        const c = db.fetch(`${message.channel.guild.id}.starboard.count.${message.id}`)
        if (posted == null) {
          if (c >= min) {
            const starMsg = await this._client.createMessage(cha, await populateEmbed(message, msg))
            return db.set(`${message.channel.guild.id}.starboard.posted.${message.id}`, starMsg.id)
          }
        } else if (posted != null) {
          const starChannel = await message.channel.guild.channels.get(cha)
          const editMsg = await starChannel.getMessage(posted)
          return await this._client.editMessage(editMsg, await populateEmbed(message, msg))
        }
      }
    } catch (e) {
      this.logger.error(e)
    }
  }
  async onReactRem (message, reaction) {
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
  }
}

let embed = {
  'embed': {}
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
    embed.embed.footer = { 'icon_url': msg.author.avatarURL, 'text': `${msg.author.username} in #${msg.channel.name}` }
    embed.embed.image = { 'url': image }
    if (msg.content !== '') embed.embed.description = msg.content
  } else if (min === false) {
    embed.embed.color = 0xFFC300
    embed.embed.title = `${c} ${emote}`
    embed.embed.timestamp = new Date()
    embed.embed.footer = { 'text': msg.id }
    embed.embed.thumbnail = { 'url': msg.author.avatarURL }
    embed.embed.image = { 'url': image }
    embed.embed.fields = [
      { 'name': 'Author', 'value': msg.author.mention, 'inline': true },
      { 'name': 'Channel', 'value': msg.channel.mention, 'inline': true },
      { 'name': 'Jump to message', 'value': `[Jump](https://discordapp.com/channels/${message.channel.guild.id}/${msg.channel.id}/${msg.id})`, 'inline': true }
    ]
    if (msg.content !== '') {
      embed.embed.fields.push({
        'name': 'Content',
        'value': msg.content,
        'inline': true
      })
    }
  }
  return embed
}

module.exports = reactionHandler
