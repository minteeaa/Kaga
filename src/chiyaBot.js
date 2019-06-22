const { Client } = require('sylphy')
const randomColor = require('randomcolor')
const yaml = require('js-yaml')
const fs = require('fs')
const emotes = yaml.safeLoad(fs.readFileSync('./src/lang/emotes.yml', 'utf8'))

class ChiyaBot extends Client {
  constructor (options = {}) {
    super(options)
    this.normalColor = parseInt(randomColor({ luminosity: 'light', hue: 'pink' }).replace('#', '0x'))
    this.red = randomColor({ hue: 'red' }).replace('#', '0x')
    this.green = randomColor({ hue: 'green' }).replace('#', '0x')
    this.blue = randomColor({ hue: 'blue' }).replace('#', '0x')
    this.deny = emotes.deny
    this.success = emotes.success
    this.question = emotes.question
  }
}

module.exports = ChiyaBot
