module.exports = {
  priority: 2,
  process: container => {
    /* eslint-disable */
    const { client, msg, commands } = container
    const isPrivate = container.isPrivate = !msg.channel.guild
    /* eslint-enable */
    const db = require('quick.db')
    let pre = db.fetch(`prefix_${msg.channel.guild.id}`)
    let prefix
    if (!pre) {
      prefix = '-!'
    } else {
      prefix = pre
    }

    if (!msg.content.startsWith(prefix)) {
      return Promise.resolve()
    }

    const rawArgs = msg.content.substring(prefix.length).split(' ')
    const trigger = container.trigger = rawArgs[0].toLowerCase()
    container.isCommand = commands.has(trigger)
    container.rawArgs = rawArgs.slice(1).filter(v => !!v)

    return Promise.resolve(container)
  }
}
