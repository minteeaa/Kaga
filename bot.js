const Client = require('sylphy')
require('dotenv').config()
const path = require('path')
const util = require('util')
const resolve = (str) => path.join('src', str)

const bot = new Client({
  token: process.env.TOKEN,
  modules: resolve('modules')
})

bot.unregister('middleware', true)
bot.register('middleware', resolve('middleware'))

const logger = bot.logger

logger.debug([
  'Reika v2 running',
  'With some cool logging!'
].join('\n'))
logger.error(new Error('Error test'))

const commands = resolve('/commands')
bot.register('commands', commands, {
  groupedCommands: true
})
bot.on('commander:registered', logger.log)

bot.on('ready', () => {
  logger.info(`Logged in as ${bot.user.username}`)
})

bot.run()

process.on('unhandledRejection', (reason, promise) => {
  if (typeof reason === 'undefined') return
  logger.error(`Unhandled rejection: ${reason} - ${util.inspect(promise)}`)
})

// ᵛ²
