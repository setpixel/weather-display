'use strict'

var config = require('./config')

class Logger {

  static log( message, level ) {
    if (!level) { level = 0 }
    if (level >= config.logLevel) {
      console.log(`|| ${message}`)
    }
  }
  
}

module.exports = Logger