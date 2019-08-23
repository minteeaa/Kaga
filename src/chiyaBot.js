const { Client } = require('sylphy')
const randomColor = require('randomcolor')

class ChiyaBot extends Client {
  constructor (options = {}) {
    super(options)
    this.normalColor = parseInt(randomColor({ luminosity: 'light', hue: 'pink' }).replace('#', '0x'))
    this.red = randomColor({ hue: 'red' }).replace('#', '0x')
    this.green = randomColor({ hue: 'green' }).replace('#', '0x')
    this.blue = randomColor({ hue: 'blue' }).replace('#', '0x')
    this.deny = '<:deny:589500870765445177>'
    this.success = '<:success:589489715905036289>'
    this.question = '<:question:589499527518486538>'
  }
}

module.exports = ChiyaBot
