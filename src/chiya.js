const ChiyaBot = require('./chiyaBot.js')
require('dotenv').config()
const chalk = require('chalk')
const { createLogger, format, transports } = require('winston')
const { colorize, combine, printf } = format
const moment = require('moment')
const path = require('path')
const util = require('util')
const resolve = (str) => path.join('src', str)

const logFormat = printf((info) => { return `[${chalk.grey(moment().format('hh:mm:ss'))}] ${info.level}: ${info.message}` })

const logger = createLogger({
  level: 'silly',
  format: combine(
    colorize(),
    logFormat
  ),
  transports: [new transports.Console()]
})

const chiya = new ChiyaBot({
  token: process.env.TOKEN,
  modules: resolve('modules'),
  disableEveryone: false,
  autoreconnect: true
})

chiya.unregister('middleware', true)
chiya.unregister('logger', 'console')
chiya.register('logger', 'winston', logger)
chiya.register('middleware', resolve('middleware'))

logger.debug('Chiya running')
logger.error(new Error('Error test'))

const commands = resolve('commands')
chiya.register('commands', commands, {
  groupedCommands: true
})
chiya.on('commander:registered', logger.log)

chiya.on('ready', () => {
  const guilds = chiya.guilds.size
  const users = chiya.users.size

  /*
    * 0 = Playing
    * 1 = Twitch
    * 2 = Listening to
    * 3 = Watching
    */

  const statuses = [
    { type: 3, name: 'you type' },
    { type: 0, name: 'the saxophone' },
    { type: 2, name: 'your voices' },
    { type: 3, name: 'some lewdies' },
    { type: 0, name: 'a fun game' },
    { type: 3, name: 'anime' },
    { type: 0, name: 'the piano' },
    { type: 0, name: 'with cute girls' },
    { type: 0, name: 'the violin' },
    { type: 3, name: 'you struggle' },
    { type: 0, name: 'with catgirls' },
    { type: 0, name: `with ${users} users` },
    { type: 2, name: `to ${users} users` },
    { type: 3, name: `${users} users` },
    { type: 0, name: `in ${guilds} servers` },
    { type: 3, name: `${guilds} servers` }
  ]

  chiya.changeStatus = () => {
    let type
    const cstat = statuses[~~(Math.random() * statuses.length)]
    if (cstat.type === 0) type = 'Playing'
    if (cstat.type === 2) type = 'Listening'
    if (cstat.type === 3) type = 'Watching'
    chiya.editStatus({ name: cstat.name, type: cstat.type || 0 })
    logger.info(chalk.yellow.bold(`Status changed: '${type} ${cstat.name}'`))
  }

  setInterval(() => chiya.changeStatus(), 120000)
  logger.info(`Logged in as ${chiya.user.username}`)
})

chiya.run()

process.on('unhandledRejection', (reason, promise) => {
  if (typeof reason === 'undefined') return
  logger.error(`Unhandled rejection: ${reason} - ${util.inspect(promise)}`)
})

// ᵛ²
