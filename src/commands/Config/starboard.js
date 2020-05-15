const { Command } = require('klasa')
const db = require('quick.db')
const emoji = require('node-emoji')

module.exports = class extends Command {
  constructor (...args) {
    super(...args, {
      aliases: ['sb'],
      cooldown: 5,
      description: language => language.get('COMMAND_STARBOARD_DESCRIPTION'),
      permissionLevel: 0,
      runIn: ['text'],
      usage: '<config> [option] [<secondary>] [<value>]'
    })
  }

  /* FIXME: this */

  async run (message, [context, option, suboption, setter]) {
    if (context === 'block') {
      if (['add', 'remove'].includes(option)) {
        if (suboption === `<@${message.mentions[0].id}>`) {
          if (option === 'add') {
            if (!db.fetch(`${message.channel.guild.id}.starboard.blocked`)) db.set(`${message.channel.guild.id}.starboard.blocked`, [message.mentions[0].id])
            else if (db.fetch(`${message.channel.guild.id}.starboard.blocked`).includes(message.mentions[0].id)) return message.channel.send(`${client.deny} ${client.en_us.sbuserblocked}`)
            else db.push(`${message.channel.guild.id}.starboard.blocked`, message.mentions[0].id)
            return message.channel.send(`${client.en_us.sbblockusersuccess.replace('$USER', message.mentions[0].mention)}`)
          } else if (option === 'remove') {
            if (!db.fetch(`${message.channel.guild.id}.starboard.blocked`)) return message.channel.send(`${client.deny} ${client.en_us.sbblocklistempty}`)
            else if (!db.fetch(`${message.channel.guild.id}.starboard.blocked`).includes(message.mentions[0].id)) return message.channel.send(`${client.deny} ${client.en_us.sbusernotblocked}`)
            else {
              let nE = removeA(db.fetch(`${message.channel.guild.id}.starboard.blocked`), message.mentions[0].id)
              db.set(`${message.channel.guild.id}.starboard.blocked`, nE)
              return message.channel.send(`${client.success} ${client.en_us.sbunblockusersuccess.replace('$USER', message.mentions[0].mention)}`)
            }
          }
        }
      }
    } else if (context === 'config') {
      const defTF = [1, 3, 6]
      const defInt = 2
      const defEmote = 4
      const defChannel = 5
      const defBM = 7
      if (!db.fetch(`${message.channel.guild.id}.starboard.settings.minimal`)) db.set(`${message.channel.guild.id}.starboard.settings.minimal`, false)
      if (!db.fetch(`${message.channel.guild.id}.starboard.settings.minimum`)) db.set(`${message.channel.guild.id}.starboard.settings.minimum`, 2)
      if (!db.fetch(`${message.channel.guild.id}.starboard.settings.selfstar`)) db.set(`${message.channel.guild.id}.starboard.settings.selfstar`, false)
      if (!db.fetch(`${message.channel.guild.id}.starboard.settings.emoji`)) db.set(`${message.channel.guild.id}.starboard.settings.emoji`, ':star:')
      if (!db.fetch(`${message.channel.guild.id}.starboard.settings.channel`)) db.set(`${message.channel.guild.id}.starboard.settings.channel`, 'None')
      if (!db.fetch(`${message.channel.guild.id}.starboard.settings.botstars`)) db.set(`${message.channel.guild.id}.starboard.settings.botstars`, false)
      if (!db.fetch(`${message.channel.guild.id}.starboard.settings.blockmode.type`)) db.set(`${message.channel.guild.id}.starboard.settings.blockmode.type`, 'blacklist')
      if (defTF.includes(option) && ['clear', 'remove', 'reset', 'delete'].includes(suboption)) {
        if (option === 1) {
          db.set(`${message.channel.guild.id}.starboard.settings.minimal`, false)
          return message.channel.send(`${client.en_us.sboptreset.replace('$OPTION', 'minimal')}`)
        }
        if (option === 3) {
          db.set(`${message.channel.guild.id}.starboard.settings.selfstar`, false)
          return message.channel.send(`${client.en_us.sboptreset.replace('$OPTION', 'selfstar')}`)
        }
        if (option === 6) {
          db.set(`${message.channel.guild.id}.starboard.settings.botstars`, false)
          return message.channel.send(`${client.en_us.sboptreset.replace('$OPTION', 'botstars')}`)
        }
      } else if ((defInt === option) && ['clear', 'remove', 'reset', 'delete'].includes(suboption)) {
        if (option === defInt) {
          db.set(`${message.channel.guild.id}.starboard.settings.minimum`, 2)
          return message.channel.send(`${client.en_us.sboptreset.replace('$OPTION', 'minimum')}`)
        }
      } else if ((defEmote === option) && ['clear', 'remove', 'reset', 'delete'].includes(suboption)) {
        if (option === defEmote) {
          db.set(`${message.channel.guild.id}.starboard.settings.emoji`, 'star')
          return message.channel.send(`${client.en_us.sboptreset.replace('$OPTION', 'emoji')}`)
        }
      } else if ((defChannel === option) && ['clear', 'remove', 'reset', 'delete'].includes(suboption)) {
        if (option === defChannel) {
          db.set(`${message.channel.guild.id}.starboard.settings.channel`, 'None')
          return message.channel.send(`${client.en_us.sboptreset.replace('$OPTION', 'channel')}`)
        }
      } else if ((defBM === option) && ['clear', 'remove', 'reset', 'delete'].includes(suboption)) {
        if (option === defBM) {
          db.set(`${message.channel.guild.id}.starboard.settings.blockmode.type`, 'blacklist')
          return message.channel.send(`${client.en_us.sboptreset.replace('$OPTION', 'blockmode.type')}`)
        }
      }
      if (option === '1') {
        if (!['true', 'false'].includes(suboption)) return message.channel.send(`${client.deny} ${client.en_us.sbtruefalse}`)
        else if (suboption === 'true') {
          if (db.fetch(`${message.channel.guild.id}.starboard.settings.minimal`) === false) {
            db.set(`${message.channel.guild.id}.starboard.settings.minimal`, true)
            return message.channel.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'minimal').replace('$VALUE', 'true')}`)
          } else if (db.fetch(`${message.channel.guild.id}.starboard.settings.minimal`) === true) return message.channel.send(`${client.deny} ${client.en_us.sbtrue}`)
        } else if (suboption === 'false') {
          if (db.fetch(`${message.channel.guild.id}.starboard.settings.minimal`) === true) {
            db.set(`${message.channel.guild.id}.starboard.settings.minimal`, false)
            return message.channel.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'minimal').replace('$VALUE', 'false')}`)
          } else if (db.fetch(`${message.channel.guild.id}.starboard.settings.minimal`) === false) return message.channel.send(`${client.deny} ${client.en_us.sbfalse}`)
        }
      } else if (option === '2') {
        if (isNaN(filterInt(suboption))) return message.channel.send(`${client.deny} ${client.en_us.sbnumerical}`)
        else {
          db.set(`${message.channel.guild.id}.starboard.settings.minimum`, filterInt(suboption))
          return message.channel.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'minimum').replace('$VALUE', filterInt(suboption))}`)
        }
      } else if (option === '3') {
        if (!['true', 'false'].includes(suboption)) return message.channel.send(`${client.deny} ${client.en_us.sbtruefalse}`)
        else if (suboption === 'true') {
          if (db.fetch(`${message.channel.guild.id}.starboard.settings.selfstar`) === false) {
            db.set(`${message.channel.guild.id}.starboard.settings.selfstar`, true)
            return message.channel.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'selfstar').replace('$VALUE', 'true')}`)
          } else if (db.fetch(`${message.channel.guild.id}.starboard.settings.selfstar`) === true) return message.channel.send(`${client.deny} ${client.en_us.sbtrue}`)
        } else if (suboption === 'false') {
          if (db.fetch(`${message.channel.guild.id}.starboard.settings.selfstar`) === true) {
            db.set(`${message.channel.guild.id}.starboard.settings.selfstar`, false)
            return message.channel.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'selfstar').replace('$VALUE', 'false')}`)
          } else if (db.fetch(`${message.channel.guild.id}.starboard.settings.selfstar`) === false) return message.channel.send(`${client.deny} ${client.en_us.sbfalse}`)
        }
      } else if (option === '4') {
        if (emoji.hasEmoji(suboption) === true) {
          db.set(`${message.channel.guild.id}.starboard.settings.emoji`, emoji.unemojify(suboption))
          return message.channel.send(`${client.success} ${client.en_us.sbemojiset.replace('$EMOJI', db.fetch(`${message.channel.guild.id}.starboard.settings.emoji`))}`)
        } else {
          let emID
          let s = 0
          const str = suboption.replace(/</gi, '').replace(/>/gi, '')
          for (let x = 0; x < suboption.length; x++) {
            if (suboption.charAt(x) === ':') s++
            if (s === 2) {
              s++
              emID = str.slice(x)
            }
          }
          let emy = false
          for (const x in message.channel.guild.emojis) {
            if (emID === message.channel.guild.emojis[x].id.toString()) {
              emy = true
            }
          }
          if (emy === true) {
            db.set(`${message.channel.guild.id}.starboard.settings.emoji`, suboption)
            return message.channel.send(`${client.success} ${client.en_us.sbemojiset.replace('$EMOJI', db.fetch(`${message.channel.guild.id}.starboard.settings.emoji`))}`)
          } else return message.channel.send(`${client.deny} ${client.en_us.sbemojinoguild}`)
        }
      } else if (option === '5') {
        if (message.channelMentions.length === 0) return message.channel.send(`${client.deny} ${client.en_us.sbchannelmention}`)
        else if (message.channelMentions.length > 0) {
          db.set(`${message.channel.guild.id}.starboard.settings.channel`, message.channelMentions[0])
          message.channel.send(`${client.success} ${client.en_us.sbchannelset.replace('$CHANNEL', `<#${db.fetch(`${message.channel.guild.id}.starboard.settings.channel`)}>`)}`)
        }
      } else if (option === '6') {
        if (!['true', 'false'].includes(suboption)) return message.channel.send(`${client.deny} ${client.en_us.sbtruefalse}`)
        else if (suboption === 'true') {
          if (db.fetch(`${message.channel.guild.id}.starboard.settings.botstars`) === false) {
            db.set(`${message.channel.guild.id}.starboard.settings.botstars`, true)
            return message.channel.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'remove bot stars').replace('$VALUE', 'true')}`)
          } else if (db.fetch(`${message.channel.guild.id}.starboard.settings.botstars`) === true) return message.channel.send(`${client.deny} ${client.en_us.sbtrue}`)
        } else if (suboption === 'false') {
          if (db.fetch(`${message.channel.guild.id}.starboard.settings.botstars`) === true) {
            db.set(`${message.channel.guild.id}.starboard.settings.botstars`, false)
            return message.channel.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'remove bot stars').replace('$VALUE', 'false')}`)
          } else if (db.fetch(`${message.channel.guild.id}.starboard.settings.botstars`) === false) return message.channel.send(`${client.deny} ${client.en_us.sbfalse}`)
        }
      } else if (option === '7') {
        if (!['whitelist', 'blacklist'].includes(suboption)) return message.channel.send(`${client.deny} ${client.en_us.sbwblist}`)
        else if (suboption === 'whitelist') {
          if (db.fetch(`${message.channel.guild.id}.starboard.settings.blockmode.type`) === 'blacklist') {
            db.set(`${message.channel.guild.id}.starboard.settings.blockmode.type`, 'whitelist')
            return message.channel.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'block mode').replace('$VALUE', 'whitelist')}`)
          } else if (db.fetch(`${message.channel.guild.id}.starboard.settings.blockmode.type`) === 'whitelist') return message.channel.send(`${client.deny} ${client.en_us.sbwl}`)
        } else if (suboption === 'blacklist') {
          if (db.fetch(`${message.channel.guild.id}.starboard.settings.blockmode.type`) === 'whitelist') {
            db.set(`${message.channel.guild.id}.starboard.settings.blockmode.type`, 'blacklist')
            return message.channel.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'block mode').replace('$VALUE', 'false')}`)
          } else if (db.fetch(`${message.channel.guild.id}.starboard.settings.blockmode.type`) === 'blacklist') return message.channel.send(`${client.deny} ${client.en_us.sbbl}`)
        }
      } else if (option === 'whitelist' || option === 'blacklist') {
        if (!suboption || !setter) return
        if (suboption === 'add' && setter != null) {
          const userM = message.mentions[0].id
          if (userM == null) return message.channel.send(`${client.deny} ${client.en_us.sbnousermention}`)
          else {
            db.push(`${message.channel.guild.id}.starboard.settings.blockmode.userlist`, userM)
            return message.channel.send(`${client.success} ${client.en_us.sblistadd.replace('$USER', message.mentions[0].username).replace('$LIST', db.fetch(`${message.channel.guild.id}.starboard.settings.blockmode.type`))}`)
          }
        } else if (suboption === 'remove' && setter != null) {
          const userM = message.mentions[0].id
          if (userM == null) return message.channel.send(`${client.deny} ${client.en_us.sbnousermention}`)
          else {
            db.set(`${message.channel.guild.id}.starboard.settings.blockmode.userlist`, removeA(db.fetch(`${message.channel.guild.id}.starboard.settings.blockmode.userlist`), userM))
            return message.channel.send(`${client.success} ${client.en_us.sblistrem.replace('$USER', message.mentions[0].username).replace('$LIST', db.fetch(`${message.channel.guild.id}.starboard.settings.blockmode.type`))}`)
          }
        }
      } else if (!option) {
        let ch
        if (db.fetch(`${message.channel.guild.id}.starboard.settings.channel`) === 'None') ch = 'None'
        else ch = `<#${db.fetch(`${message.channel.guild.id}.starboard.settings.channel`)}>`
        const emote = db.fetch(`${message.channel.guild.id}.starboard.settings.emoji`)
        const embed = {
          'embed': {
            'author': {
              'name': `${message.channel.guild.name}'s Starboard Config`
            },
            'fields': [
              {
                'name': `\`1\` ${client.en_us.sbminimal}`,
                'value': db.fetch(`${message.channel.guild.id}.starboard.settings.minimal`),
                'inline': true
              },
              {
                'name': `\`2\` ${client.en_us.sbminimum}`,
                'value': db.fetch(`${message.channel.guild.id}.starboard.settings.minimum`),
                'inline': true
              },
              {
                'name': `\`3\` ${client.en_us.sbselfstar}`,
                'value': db.fetch(`${message.channel.guild.id}.starboard.settings.selfstar`),
                'inline': true
              },
              {
                'name': `\`4\` ${client.en_us.sbemoji}`,
                'value': `${emote}`,
                'inline': true
              },
              {
                'name': `\`5\` ${client.en_us.sbchannel}`,
                'value': ch,
                'inline': true
              },
              {
                'name': `\`6\` ${client.en_us.sbremovebotstars}`,
                'value': db.fetch(`${message.channel.guild.id}.starboard.settings.botstars`),
                'inline': true
              },
              {
                'name': `\`7\` ${client.en_us.sbblockmode}`,
                'value': db.fetch(`${message.channel.guild.id}.starboard.settings.blockmode.type`),
                'inline': true
              }
            ]
          }
        }
        message.channel.send({ embed })
      }
    }
  }
}

function filterInt (value) {
  if (/^[-+]?(\d+|Infinity)$/.test(value)) {
    return Number(value)
  } else {
    return NaN
  }
}

function removeA (arr) {
  let what
  const a = arguments
  let L = a.length
  let ax
  while (L > 1 && arr.length) {
    what = a[--L]
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1)
    }
  }
  return arr
}
