'use strict'

var config = require('./config')
var moment = require('moment')

class Logger {

  static log( message, level ) {
    if (!level) { level = 0 }
    if (level >= config.logLevel) {
      console.log(moment().format('MM/DD/YY h:mm:ssa') + ` || ${message}`)
    }
  }
  
}

module.exports = Logger