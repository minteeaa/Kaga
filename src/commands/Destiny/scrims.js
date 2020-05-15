const { Command } = require('klasa')
const { MessageEmbed } = require('discord.js')
const moment = require('moment-timezone')
moment().format()
const db = require('quick.db')

module.exports = class extends Command {
  constructor (...args) {
    super(...args, {
      aliases: ['scrim', 'scr'],
      cooldown: 5,
      description: language => language.get('COMMAND_SCRIMS_DESCRIPTION'),
      permissionLevel: 0,
      runIn: ['text'],
      usage: '[create]'
    })
  }

  async run (message, [create]) {
    if (!create) return
    const uuid = this.client.genUUID()
    db.set(`${message.id}.uuid`, uuid)
    let finalEmbed
    const reactionInfo = [
      { name: '🇦', type: 'Rumble', teamSize: 1 },
      { name: '🇧', type: 'Control', teamSize: 2 },
      { name: '🇨', type: 'Clash', teamSize: 3 },
      { name: '🇩', type: 'Momentum Control', teamSize: 4 },
      { name: '🇪', type: 'Breakthrough', teamSize: 5 },
      { name: '🇫', type: 'Countdown', teamSize: 6 },
      { name: '🇬', type: 'Elimination' },
      { name: '🇭', type: 'Lockdown' },
      { name: '🇮', type: 'Showdown' },
      { name: '🇯', type: 'Survival' },
      { name: '🇰', type: 'Mayhem Clash' },
      { name: '🇱', type: 'Scorched' },
      { name: '🇲', type: 'Team Scorched' },
      { name: '🇳', type: 'Supremacy' }
    ]
    let typeMsg
    let preMsg
    let tsMsg
    let tsz
    let finalMsg
    let mdt
    const joinedUsers = []
    const filter = response => { return response.author.id === message.author.id }
    sendPrompts(1)
    async function sendPrompts (a) {
      if (a === 1) {
        preMsg = await message.channel.send('Choose a game type:')
        const ar = []
        for (const val in reactionInfo) { ar.push(`${reactionInfo[val].name} ${reactionInfo[val].type}`) }
        const typeList = await ar.join('\n')
        typeMsg = await message.channel.send(new MessageEmbed().setDescription(typeList))
        for (const s in reactionInfo) { await typeMsg.react(reactionInfo[s].name) }
      } else if (a === 2) {
        const ar = []
        for (const val in reactionInfo) { if (reactionInfo[val].teamSize != null) ar.push(`${reactionInfo[val].name} ${reactionInfo[val].teamSize}v${reactionInfo[val].teamSize}`) }
        const tsList = await ar.join('\n')
        tsMsg = await message.channel.send(new MessageEmbed().setDescription(tsList))
        for (const s in reactionInfo) { if (reactionInfo[s].teamSize != null) await tsMsg.react(reactionInfo[s].name) }
      } else if (a === 3) {
        await message.channel.send('Type a description for this match post.').then((msg) => {
          message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
              const col = collected.first().content
              if (col === 'cancel') return message.channel.send('Cancelled match creation.')
              db.set(`${message.id}.scrim.desc`, col)
              msg.delete()
              collected.first().delete()
              return sendPrompts(4)
            })
            .catch(collected => {
              message.channel.send('You got so far into the match setup and then just... stopped. Or maybe it was an error. Try again soon.')
            })
        })
      } else if (a === 4) {
        preMsg.delete()
        await message.channel.send('Type a time in the format **h:m am/pm m/d tz**\nExample: **02:06 PM 03/27 EST**').then((msg) => {
          message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
              const col = collected.first().content
              if (col === 'cancel') return message.channel.send('Cancelled match creation.')
              const md = col.slice(0, 14)
              const mtz = col.slice(15, 18)
              let date = false
              let timezone = false
              mdt = moment(md, 'HH:mm A MM/DD', true)
              if (moment(md, 'HH:mm A MM/DD', true).isValid()) date = true
              if (moment.tz(mtz).zoneAbbr() === mtz) timezone = true
              if (date && timezone === true) {
                msg.delete()
                collected.first().delete()
                db.set(`${message.id}.scrim.time.moment`, md)
                db.set(`${message.id}.scrim.date`, col)
                genFinalEmbed(message)
              } else {
                return msg.edit('Type a time in the format **h:m am/pm m/d tz**\nExample: **02:06 PM 03/27 EST**\nDate format must be followed to progress. Try again soon.')
              }
            })
            .catch(collected => {
              message.channel.send('You got so far into the match setup and then just... stopped. Or maybe it was an error. Try again soon.')
            })
        })
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
    let ssize
    async function genFinalEmbed (a) {
      const sdesc = db.fetch(`${a.id}.scrim.desc`)
      const sdate = db.fetch(`${a.id}.scrim.date`)
      const stype = db.fetch(`${a.id}.scrim.type`)
      const suuid = db.fetch(`${a.id}.uuid`)
      ssize = db.fetch(`${suuid}.teamsize`)
      finalEmbed = {
        fields: [
          {
            name: 'Game Type',
            value: stype,
            inline: true
          },
          {
            name: 'Team Size',
            value: ssize,
            inline: true
          },
          {
            name: 'Decription',
            value: sdesc
          },
          {
            name: 'Time',
            value: sdate
          },
          {
            name: `Guardians Joined (0/${ssize})`,
            value: 'None'
          }
        ],
        footer: {
          text: uuid
        }
      }
      finalMsg = await a.channel.send({ embed: finalEmbed })
      finalMsg.react('✅')
      finalMsg.react('❎')
    }

    this.client.on('messageReactionAdd', async (reaction, member) => {
      if (member.bot) return
      let teamGame
      if (typeMsg != null && reaction.message.id === typeMsg.id) {
        for (const r in reactionInfo) {
          if (reactionInfo[r].name === reaction._emoji.name) {
            db.set(`${message.id}.scrim.type`, reactionInfo[r].type)
            if (['🇦', '🇱'].includes(reaction._emoji.name)) teamGame = false
            else teamGame = true
          }
        }
        typeMsg.delete()
        typeMsg = null
        if (teamGame) {
          preMsg.edit('Choose a team size:')
          sendPrompts(2)
        } else {
          db.set(`${uuid}.teamsize`, 'FFA')
          sendPrompts(3)
        }
      } else if (tsMsg != null && reaction.message.id === tsMsg.id) {
        for (const r in reactionInfo) {
          if (reactionInfo[r].name === reaction._emoji.name) {
            finalEmbed.addField('Team Size', `${reactionInfo[r].teamSize}v${reactionInfo[r].teamSize}`)
            tsz = reactionInfo[r].teamSize
            db.set(`${uuid}.teamsize`, tsz)
          }
        }
        tsMsg.delete()
        preMsg.delete()
        sendPrompts(3)
      } else if (finalMsg != null && reaction.message.id === finalMsg.id) {
        if (reaction._emoji.name === '✅') {
          const now = moment()
          const then = mdt._d
          if (now.diff(then) > 0) return
          reaction.message.reactions.resolve('✅').users.remove(member.id)
          if (!joinedUsers.includes(`${member.username}#${member.discriminator}`)) joinedUsers.push(`${member.username}#${member.discriminator}`)
          finalEmbed.fields[4] = { name: `Guardians Joined (${joinedUsers.length}/${ssize})`, value: joinedUsers.toString() }
          finalMsg.edit({ embed: finalEmbed })
        } else if (reaction._emoji.name === '❎') {
          const now = moment()
          const then = mdt._d
          if (now.diff(then) > 0) return
          reaction.message.reactions.resolve('❎').users.remove(member.id)
          const nnE = removeA(joinedUsers, `${member.username}#${member.discriminator}`)
          let nmG
          let nC
          if (nnE.length < 1) nmG = 'None'
          else nmG = nnE.toString()
          if (nmG === 'None') nC = 0
          finalEmbed.fields[4] = { name: `Guardians Joined (${nC}/${ssize})`, value: nmG }
          finalMsg.edit({ embed: finalEmbed })
        }
      }
    })
  }
}
