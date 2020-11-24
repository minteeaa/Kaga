const yaml = require('js-yaml')
const fs = require('file-system')
class Language {
  static getLocale (lang, cmd, key) {
    const content = fs.readFileSync(`src/languages/${lang}.yml`, 'utf-8')
    const data = yaml.safeLoad(content)
    return data.commands[cmd][key]
  }
}
module.exports = Language
