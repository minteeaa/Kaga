const { Command } = require('sylphy')
const db = require('quick.db')
const emoji = require('node-emoji')

class starboard extends Command {
  constructor (...args) {
    super(...args, {
      name: 'starboard',
      aliases: 'sb',
      cooldown: 5,
      options: { guildOnly: true },
      usage: [
        { name: 'option', displayName: 'option', type: 'string', optional: true },
        { name: 'option2', displayName: 'option2', type: 'string', optional: true },
        { name: 'option3', displayName: 'option3', type: 'string', optional: true },
        { name: 'option4', displayName: 'option4', type: 'string', optional: true }
      ]
    })
  }
  handle ({ args, client, msg }, responder) {
    const option1 = args.option
    const option2 = args.option2
    const option3 = args.option3
    if (option1 === 'block') {
      if (['add', 'remove'].includes(option2)) {
        if (option3 === `<@${msg.mentions[0].id}>`) {
          if (option2 === 'add') {
            if (!db.fetch(`${msg.channel.guild.id}.starboard.blocked`)) db.set(`${msg.channel.guild.id}.starboard.blocked`, [msg.mentions[0].id])
            else if (db.fetch(`${msg.channel.guild.id}.starboard.blocked`).includes(msg.mentions[0].id)) return responder.send(`${client.deny} ${client.en_us.sbuserblocked}`)
            else db.push(`${msg.channel.guild.id}.starboard.blocked`, msg.mentions[0].id)
            return responder.send(`${client.success} ${client.en_us.sbblockusersuccess.replace('$USER', msg.mentions[0].mention)}`)
          } else if (option2 === 'remove') {
            if (!db.fetch(`${msg.channel.guild.id}.starboard.blocked`)) return responder.send(`${client.deny} ${client.en_us.sbblocklistempty}`)
            else if (!db.fetch(`${msg.channel.guild.id}.starboard.blocked`).includes(msg.mentions[0].id)) return responder.send(`${client.deny} ${client.en_us.sbusernotblocked}`)
            else {
              let nE = removeA(db.fetch(`${msg.channel.guild.id}.starboard.blocked`), msg.mentions[0].id)
              db.set(`${msg.channel.guild.id}.starboard.blocked`, nE)
              return responder.send(`${client.success} ${client.en_us.sbunblockusersuccess.replace('$USER', msg.mentions[0].mention)}`)
            }
          }
        }
      }
    } else if (option1 === 'config') {
      const defTF = [1, 3, 6]
      const defInt = 2
      const defEmote = 4
      const defChannel = 5
      const defBM = 7
      if (!db.fetch(`${msg.channel.guild.id}.starboard.settings.minimal`)) db.set(`${msg.channel.guild.id}.starboard.settings.minimal`, false)
      if (!db.fetch(`${msg.channel.guild.id}.starboard.settings.minimum`)) db.set(`${msg.channel.guild.id}.starboard.settings.minimum`, 2)
      if (!db.fetch(`${msg.channel.guild.id}.starboard.settings.selfstar`)) db.set(`${msg.channel.guild.id}.starboard.settings.selfstar`, false)
      if (!db.fetch(`${msg.channel.guild.id}.starboard.settings.emoji`)) db.set(`${msg.channel.guild.id}.starboard.settings.emoji`, 'star')
      if (!db.fetch(`${msg.channel.guild.id}.starboard.settings.channel`)) db.set(`${msg.channel.guild.id}.starboard.settings.channel`, 'None')
      if (!db.fetch(`${msg.channel.guild.id}.starboard.settings.botstars`)) db.set(`${msg.channel.guild.id}.starboard.settings.botstars`, false)
      if (!db.fetch(`${msg.channel.guild.id}.starboard.settings.blockmode`)) db.set(`${msg.channel.guild.id}.starboard.settings.blockmode`, 'blacklist')
      if (defTF.includes(option2) && ['clear', 'remove', 'reset', 'delete'].includes(option3)) {
        if (option2 === 1) {
          db.set(`${msg.channel.guild.id}.starboard.settings.minimal`, false)
          return responder.send(`${client.en_us.sboptreset.replace('$OPTION', 'minimal')}`)
        }
        if (option2 === 3) {
          db.set(`${msg.channel.guild.id}.starboard.settings.selfstar`, false)
          return responder.send(`${client.en_us.sboptreset.replace('$OPTION', 'selfstar')}`)
        }
        if (option2 === 6) {
          db.set(`${msg.channel.guild.id}.starboard.settings.botstars`, false)
          return responder.send(`${client.en_us.sboptreset.replace('$OPTION', 'botstars')}`)
        }
      } else if ((defInt === option2) && ['clear', 'remove', 'reset', 'delete'].includes(option3)) {
        if (option2 === defInt) {
          db.set(`${msg.channel.guild.id}.starboard.settings.minimum`, 2)
          return responder.send(`${client.en_us.sboptreset.replace('$OPTION', 'minimum')}`)
        }
      } else if ((defEmote === option2) && ['clear', 'remove', 'reset', 'delete'].includes(option3)) {
        if (option2 === defEmote) {
          db.set(`${msg.channel.guild.id}.starboard.settings.emoji`, 'star')
          return responder.send(`${client.en_us.sboptreset.replace('$OPTION', 'emoji')}`)
        }
      } else if ((defChannel === option2) && ['clear', 'remove', 'reset', 'delete'].includes(option3)) {
        if (option2 === defChannel) {
          db.set(`${msg.channel.guild.id}.starboard.settings.channel`, 'None')
          return responder.send(`${client.en_us.sboptreset.replace('$OPTION', 'channel')}`)
        }
      } else if ((defBM === option2) && ['clear', 'remove', 'reset', 'delete'].includes(option3)) {
        if (option2 === defBM) {
          db.set(`${msg.channel.guild.id}.starboard.settings.blockmode`, 'blacklist')
          return responder.send(`${client.en_us.sboptreset.replace('$OPTION', 'blockmode')}`)
        }
      }
      if (option2 === '1') {
        if (!['true', 'false'].includes(option3)) return responder.send(`${client.deny} ${client.en_us.sbtruefalse}`)
        else if (option3 === 'true') {
          if (db.fetch(`${msg.channel.guild.id}.starboard.settings.minimal`) === false) {
            db.set(`${msg.channel.guild.id}.starboard.settings.minimal`, true)
            return responder.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'minimal').replace('$VALUE', 'true')}`)
          } else if (db.fetch(`${msg.channel.guild.id}.starboard.settings.minimal`) === true) return responder.send(`${client.deny} ${client.en_us.sbtrue}`)
        } else if (option3 === 'false') {
          if (db.fetch(`${msg.channel.guild.id}.starboard.settings.minimal`) === true) {
            db.set(`${msg.channel.guild.id}.starboard.settings.minimal`, false)
            return responder.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'minimal').replace('$VALUE', 'false')}`)
          } else if (db.fetch(`${msg.channel.guild.id}.starboard.settings.minimal`) === false) return responder.send(`${client.deny} ${client.en_us.sbfalse}`)
        }
      } else if (option2 === '2') {
        if (isNaN(filterInt(option3))) return responder.send(`${client.deny} ${client.en_us.sbnumerical}`)
        else {
          db.set(`${msg.channel.guild.id}.starboard.settings.minimum`, filterInt(option3))
          return responder.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'minimum').replace('$VALUE', filterInt(option3))}`)
        }
      } else if (option2 === '3') {
        if (!['true', 'false'].includes(option3)) return responder.send(`${client.deny} ${client.en_us.sbtruefalse}`)
        else if (option3 === 'true') {
          if (db.fetch(`${msg.channel.guild.id}.starboard.settings.selfstar`) === false) {
            db.set(`${msg.channel.guild.id}.starboard.settings.selfstar`, true)
            return responder.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'selfstar').replace('$VALUE', 'true')}`)
          } else if (db.fetch(`${msg.channel.guild.id}.starboard.settings.selfstar`) === true) return responder.send(`${client.deny} ${client.en_us.sbtrue}`)
        } else if (option3 === 'false') {
          if (db.fetch(`${msg.channel.guild.id}.starboard.settings.selfstar`) === true) {
            db.set(`${msg.channel.guild.id}.starboard.settings.selfstar`, false)
            return responder.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'selfstar').replace('$VALUE', 'false')}`)
          } else if (db.fetch(`${msg.channel.guild.id}.starboard.settings.selfstar`) === false) return responder.send(`${client.deny} ${client.en_us.sbfalse}`)
        }
      } else if (option2 === '4') {
        if (emoji.hasEmoji(option3) === true) {
          db.set(`${msg.channel.guild.id}.starboard.settings.emoji`, emoji.unemojify(option3))
          return responder.send(`${client.success} ${client.en_us.sbemojiset.replace('$EMOJI', db.fetch(`${msg.channel.guild.id}.starboard.settings.emoji`))}`)
        } else {
          let emID
          let s = 0
          const str = option3.replace(/</gi, '').replace(/>/gi, '')
          for (let x = 0; x < option3.length; x++) {
            if (option3.charAt(x) === ':') s++
            if (s === 2) {
              s++
              emID = str.slice(x)
            }
          }
          let emy = false
          for (let x in msg.channel.guild.emojis) {
            if (emID === msg.channel.guild.emojis[x].id.toString()) {
              emy = true
            }
          }
          if (emy === true) {
            db.set(`${msg.channel.guild.id}.starboard.settings.emoji`, option3)
            return responder.send(`${client.success} ${client.en_us.sbemojiset.replace('$EMOJI', db.fetch(`${msg.channel.guild.id}.starboard.settings.emoji`))}`)
          } else return responder.send(`${client.deny} ${client.en_us.sbemojinoguild}`)
        }
      } else if (option2 === '5') {
        if (msg.channelMentions.length === 0) return responder.send(`${client.deny} ${client.en_us.sbchannelmention}`)
        else if (msg.channelMentions.length > 0) {
          db.set(`${msg.channel.guild.id}.starboard.settings.channel`, msg.channelMentions[0])
          responder.send(`${client.success} ${client.en_us.sbchannelset.replace('$CHANNEL', `<#${db.fetch(`${msg.channel.guild.id}.starboard.settings.channel`)}>`)}`)
        }
      } else if (option2 === '6') {
        if (!['true', 'false'].includes(option3)) return responder.send(`${client.deny} ${client.en_us.sbtruefalse}`)
        else if (option3 === 'true') {
          if (db.fetch(`${msg.channel.guild.id}.starboard.settings.botstars`) === false) {
            db.set(`${msg.channel.guild.id}.starboard.settings.botstars`, true)
            return responder.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'remove bot stars').replace('$VALUE', 'true')}`)
          } else if (db.fetch(`${msg.channel.guild.id}.starboard.settings.botstars`) === true) return responder.send(`${client.deny} ${client.en_us.sbtrue}`)
        } else if (option3 === 'false') {
          if (db.fetch(`${msg.channel.guild.id}.starboard.settings.botstars`) === true) {
            db.set(`${msg.channel.guild.id}.starboard.settings.botstars`, false)
            return responder.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'remove bot stars').replace('$VALUE', 'false')}`)
          } else if (db.fetch(`${msg.channel.guild.id}.starboard.settings.botstars`) === false) return responder.send(`${client.deny} ${client.en_us.sbfalse}`)
        }
      } else if (option2 === '7') {
        if (!['whitelist', 'blacklist'].includes(option3)) return responder.send(`${client.deny} ${client.en_us.sbwblist}`)
        else if (option3 === 'whitelist') {
          if (db.fetch(`${msg.channel.guild.id}.starboard.settings.blockmode`) === 'blacklist') {
            db.set(`${msg.channel.guild.id}.starboard.settings.blockmode`, 'whitelist')
            return responder.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'block mode').replace('$VALUE', 'whitelist')}`)
          } else if (db.fetch(`${msg.channel.guild.id}.starboard.settings.blockmode`) === 'whitelist') return responder.send(`${client.deny} ${client.en_us.sbwl}`)
        } else if (option3 === 'blacklist') {
          if (db.fetch(`${msg.channel.guild.id}.starboard.settings.blockmode`) === 'whitelist') {
            db.set(`${msg.channel.guild.id}.starboard.settings.blockmode`, 'blacklist')
            return responder.send(`${client.success} ${client.en_us.sboptionset.replace('$OPTION', 'block mode').replace('$VALUE', 'false')}`)
          } else if (db.fetch(`${msg.channel.guild.id}.starboard.settings.blockmode`) === 'blacklist') return responder.send(`${client.deny} ${client.en_us.sbbl}`)
        }
      } else if (option2 === 'whitelist' || option2 === 'blacklist') {
        if (option3 === 'add') {
          if (msg.mentions.length === 0) return responder.send(`${client.deny} ${client.en_us.sbnousermention}`)
          else {
            const userM = msg.mentions[0].id
            db.push(`${msg.channel.guild.id}.starboard.lists.bw`, userM)
            return responder.send(`${client.success} ${client.en_us.sblistadd.replace('$USER', msg.mentions[0].username).replace('$LIST', db.fetch(`${msg.channel.guild.id}.starboard.settings.blockmode`))}`)
          }
        }
      } else if (!option2) {
        let ch
        if (db.fetch(`${msg.channel.guild.id}.starboard.settings.channel`) === 'None') ch = 'None'
        else ch = `<#${db.fetch(`${msg.channel.guild.id}.starboard.settings.channel`)}>`
        const embed = {
          'embed': {
            'author': {
              'name': `${msg.channel.guild.name}'s Starboard Config`
            },
            'fields': [
              {
                'name': `\`1\` ${client.en_us.sbminimal}`,
                'value': db.fetch(`${msg.channel.guild.id}.starboard.settings.minimal`),
                'inline': true
              },
              {
                'name': `\`2\` ${client.en_us.sbminimum}`,
                'value': db.fetch(`${msg.channel.guild.id}.starboard.settings.minimum`),
                'inline': true
              },
              {
                'name': `\`3\` ${client.en_us.sbselfstar}`,
                'value': db.fetch(`${msg.channel.guild.id}.starboard.settings.selfstar`),
                'inline': true
              },
              {
                'name': `\`4\` ${client.en_us.sbemoji}`,
                'value': `:${db.fetch(`${msg.channel.guild.id}.starboard.settings.emoji`)}:`,
                'inline': true
              },
              {
                'name': `\`5\` ${client.en_us.sbchannel}`,
                'value': ch,
                'inline': true
              },
              {
                'name': `\`6\` ${client.en_us.sbremovebotstars}`,
                'value': db.fetch(`${msg.channel.guild.id}.starboard.settings.botstars`),
                'inline': true
              },
              {
                'name': `\`7\` ${client.en_us.sbblockmode}`,
                'value': db.fetch(`${msg.channel.guild.id}.starboard.settings.blockmode`),
                'inline': true
              }
            ]
          }
        }
        client.createMessage(msg.channel.id, embed)
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
  let a = arguments
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

module.exports = starboard
module.exports.help = {
  description: 'Configure a nice starboard for your server.',
  usage: 'starboard block [add | remove] [@user | #channel | all]\n' +
        'starboard config [setting] [new value]',
  group: 'config'
}
