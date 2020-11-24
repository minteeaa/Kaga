require('dotenv').config()
const { AkairoClient, ListenerHandler, CommandHandler } = require('discord-akairo')
const Logger = require('./util/logger')
const db = require('quick.db')
const Language = require('./util/language')
class KagaBot extends AkairoClient {
  constructor () {
    super({
      ownerID: process.env.OWNERID
    }, {
      disableMentions: 'everyone'
    })
    this.logger = Logger
    this.lang = Language
    this.commandHandler = new CommandHandler(this, {
      directory: './src/commands',
      aliasReplacement: /-/g,
      prefix: message => {
        const pre = db.get(`${message.channel.guild.id}.settings.prefix`)
        return pre || 'ka/'
      },
      allowMention: true,
      fetchMembers: true,
      commandUtil: true,
      commandUtilLifetime: 3e5,
      commandUtilSweepInterval: 9e5,
      handleEdits: true,
      defaultCooldown: 2500,
      argumentDefaults: {
        prompt: {
          modifyStart: (msg, text) => text && `${msg.author} **::** ${text}\nType \`cancel\` to cancel this command.`,
          modifyRetry: (msg, text) => text && `${msg.author} **::** ${text}\nType \`cancel\` to cancel this command.`,
          timeout: msg => `${msg.author} **::** Time ran out, command has been cancelled.`,
          ended: msg => `${msg.author} **::** Too many retries, command has been cancelled.`,
          cancel: msg => `${msg.author} **::** Command has been cancelled.`,
          retries: 4,
          time: 30000
        }
      }
    })
    this.listenerHandler = new ListenerHandler(this, { directory: './src/listeners/' })
    this.commandHandler.useListenerHandler(this.listenerHandler)
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler
    })
    this.commandHandler.loadAll()
    this.listenerHandler.loadAll()
  }
}
const Kaga = new KagaBot()
Kaga.login(process.env.TOKEN)
