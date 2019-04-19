const { Command } = require('sylphy')

class purge extends Command {
  constructor (...args) {
    super(...args, {
      name: 'purge',
      cooldown: 10,
      options: { guildOnly: true, requirements: { permissions: { manageMessages: true } } },
      usage: [
        { name: 'amount', displayName: 'amount', type: 'int', optional: false }
      ]
    })
  }

  async handle ({ args, client, msg }, responder) {
    const purge = args.amount
    if (!msg.member.permission.has('manageMessages')) {
      return responder
        .format(['emoji:negative_squared_check_mark'])
        .send('This requires you to have a role that can manage messages.')
    } else if (!purge) {
      return responder
        .format(['emoji:negative_squared_check_mark'])
        .send('There was no amount specified to delete!')
    } else if (purge > 100) {
      return responder
        .format(['emoji:negative_squared_check_mark'])
        .send('There is a maximum of 100 messages deleted at a time.')
    } else {
      client.deleteMessage(msg.channel.id, msg.id)
      await client.getMessages(msg.channel.id, purge)
        .then(messages => {
          let msgA = []
          for (let x = 0; x < messages.length; x++) {
            msgA.push(messages[x].id)
          }
          let msgB = []
          responder
            .format(['emoji:speech_balloon'])
            .send('Attempting to delete messages...')
            .then(mess => msgB.push(mess.id))
          client.deleteMessages(msg.channel.id, msgA)
            .catch(error => {
              return responder
                .format(['emoji:interrobang'])
                .send(`An error occurred: ${error}`)
            })
          client.deleteMessages(msg.channel.id, msgB)
        })
    }
  }
}

module.exports = purge
module.exports.help = {
  description: 'Purge messages.',
  usage: 'purge <amount>',
  group: 'moderation'
}
