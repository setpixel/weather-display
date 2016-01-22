'use strict'

var express = require('express')
var app = express()
var server = require('http').Server(app)
var LocalStorage = require('node-localstorage').LocalStorage
var localStorage = new LocalStorage('./scratch')
var moment = require('moment')
var Forecast = require('forecast.io-bluebird')
var os = require("os")
var config = require('./config')
if (os.hostname() == config.hostname) {
  var gpio = require('rpi-gpio')
}

var Logger = require('./logger')
var TTS = require('./tts')
var MusicPlayer = require('./musicplayer')

var weatherData
var tts
var musicPlayer
var dayMilestones = config.dayMilestones
var quiet = true
var present = 0
var lastPresentTime = Date.now()
var presentSince = Date.now()
var wakeGreeting = true
var playingMusic = false

function init() {

  Logger.log('=============================================', 100)
  Logger.log(`STARTING UP...`, 100)
  Logger.log(`Version: ${config.version}`, 100)
  Logger.log(`Time: ${moment().format('MM/DD/YY h:mm:ssa')}`, 100)
  Logger.log(`Port: ${config.port}`, 100)
  Logger.log(`♪♫♪ GUITAR RIFF ♪♫♪`, 100)
  Logger.log('=============================================', 100)

  tts = new TTS()
  tts.speak(`Weather display... is online.`, {alert: false, bgm: true, volume: 0})

  musicPlayer = new MusicPlayer()

  // Web stuff
  app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))
  app.use(express.static('public'))
  var router = express.Router()
  router.route('/weather')
  .get(function(req, res) {
    res.json({ appearalDegrees: config.appearalDegrees, dayMilestones: dayMilestones, weather: weatherData })
  })
  router.route('/present')
  .get(function(req, res) {
    setPresent()
    present = 3
    res.json({ present: present })
  })
  router.route('/playnews')
  .get(function(req, res) {
    musicPlayer.playPodcast(config.newsPodcastUri)
    res.json({ play: present })
  })
  router.route('/playmusic')
  .get(function(req, res) {
    musicPlayer.playPlaylist(config.musicPlaylistUri)
    res.json({ play: present })
  })
  router.route('/stopmusic')
  .get(function(req, res) {
    musicPlayer.stop()
    playingMusic = false
    presentSince = Date.now()
    res.json({ play: present })
  })
  router.route('/morninggreeting')
  .get(function(req, res) {
    var textArray = []
    textArray.push('Good morning.')
    textArray.push('<break length="x-strong"/>')
    textArray.push(`It's ` + moment().format('h:mm') + `, on ` + moment().format('dddd, MMMM Do'))
    textArray.push('<break length="x-strong"/>')
    // It's a freezing 5 degrees
    textArray.push(`It's ` + Math.round(weatherData.currently.apparentTemperature) + ` degrees.`)
    textArray.push('<break length="x-strong"/>')
    textArray.push(`It's a lot colder than yesterday.`)
    textArray.push(`Make sure to wear a ` + getApperel(weatherData.currently.apparentTemperature))
    textArray.push('<break length="x-strong"/>')
    // but, it will rise to 10 degrees in the day
    textArray.push(`It will be ` + weatherData.hourly.summary)
    textArray.push('<break length="x-strong"/>')
    textArray.push(`This week, ` + weatherData.daily.summary)
    textArray.push('<break length="x-strong"/>')
    textArray.push('<break length="x-strong"/>')
    textArray.push('<break length="x-strong"/>')
    textArray.push(`Have a great day!`)

    tts.speak(textArray.join('\n\n'), {alert: true, bgm: true, volume: 7, playnews: true}, musicPlayer)
    res.json({ play: present })
  })
  router.route('/speak/:string')
  .get(function(req, res) {
    tts.speak(req.params.string, {
        alert: true,
        bgm: false,
        volume: 0,
      })
    res.json({ string: req.params.string })
  })
  app.use('/api', router)
  app.listen(config.port)

  // load internet information
  getForecast()
  setInterval(()=>{getForecast(true)}, config.forecast.checkInterval)

  // check every second for new events
  setInterval(checkTime, 1000)

  // get information from sensors
  if (gpio) {
    gpio.setup(config.gpioPin, gpio.DIR_IN, gpio.EDGE_BOTH, function(e){
      Logger.log('Error setting up GPIO Pin.')
    })

    gpio.on('change', function(channel, value) {
      Logger.log('Channel ' + channel + ' value is now ' + value)
      if (channel == config.gpioPin) {
        if (value) {
          Logger.log('+++ PIR ACTIVATED: present: 4')
          setPresent()
        } else {
          Logger.log('--- PIR deactivated: present: 3')
          present = 3
        }
      }

    })
  }

}

function getForecast(force) {
  if (!localStorage.getItem("weatherData") || force) {
    var forecast = new Forecast({
      key: config.forecast.apiKey,
      timeout: 2500
    })
    forecast.fetch(config.forecast.lat, config.forecast.long)
    .then(function(data) {
      weatherData = data
      localStorage.setItem("weatherData", JSON.stringify(weatherData))
      Logger.log('Forecast.io: Got weather data from internet.')
    })
    .catch(function(error) {
      Logger.log("Forecast.io Error: " + error)
    })
  } else {
    weatherData = JSON.parse(localStorage.getItem("weatherData"))
    Logger.log('Forecast.io: Got weather data from localstorage.')
  }
}

var previousNextThing
var previousHour
var previousMinute

function checkTime() {
  var today = new Date()
  var h = today.getHours()
  var m = today.getMinutes()
  
  var nextThing = 0
  
  for (var i = 0; i < dayMilestones.length; i++) {
    if (dayMilestones[i][0] == "Sunrise") {
      if ((today.getTime()/1000) > weatherData.daily.data[0].sunriseTime) {
        dayMilestones[i][1] = 24 + (new Date(weatherData.daily.data[1].sunriseTime*1000).getHours())+(new Date(weatherData.daily.data[1].sunriseTime*1000).getMinutes()/60)
      } else {
        dayMilestones[i][1] = (new Date(weatherData.daily.data[0].sunriseTime*1000).getHours())+(new Date(weatherData.daily.data[0].sunriseTime*1000).getMinutes()/60)
      }
    }
    if (dayMilestones[i][0] == "Sunset") {
      dayMilestones[i][1] = (new Date(weatherData.daily.data[0].sunsetTime*1000).getHours())+(new Date(weatherData.daily.data[0].sunsetTime*1000).getMinutes()/60)
    }
  }
  dayMilestones.sort(function(a, b){return a[1]-b[1]})
  for (var i = 0; i < dayMilestones.length; i++) {
    if ((today.getHours() + (today.getMinutes()/60) + (today.getSeconds()/60/60)) < dayMilestones[i][1]) {
      nextThing = i
      break
    } else {
      switch (dayMilestones[i][0]) {
        case "Breakfast":
          quiet = false
          break
        case "Sunset":
          break
        case "Bed time":
          quiet = true
          break
      }
    }
  }

  if (previousNextThing !== nextThing) {
    if (typeof previousNextThing !== 'undefined') {
      Logger.log("NEW EVENT: " + dayMilestones[previousNextThing][0] + ' quiet: ' + quiet + ' present: ' + present)
      switch (dayMilestones[previousNextThing][0]) {
        case "Wake up":
          quiet = false
          wakeGreeting = false
          tts.speak("It's " + moment().format('h:mma') + ".\n\nTime to wake up.", {alert: true, bgm: false, volume: 0})
          break
        case "Lunch":
          if (present > 1) tts.speak("It's " + moment().format('h:mma') + ". It's time to eat lunch.", {alert: true, bgm: false, volume: 0})
          break
        case "Sunset":
          if (present > 1) tts.speak("It's " + moment().format('h:mma') + ". It will be dark soon.\n\nTurn on a light.", {alert: true, bgm: false, volume: 0})
          break
        case "Get ready for bed":
          if (present > 1) tts.speak("Time to get ready for bed. It's " + moment().format('h:mma'), {alert: true, bgm: false, volume: 0})
          break
        case "Bed time":
          if (present > 1) tts.speak("Alright. It's time to go ready for bed. It's " + moment().format('h:mma'), {alert: true, bgm: false, volume: 0})
          quiet = true
          break
      }
    }
    previousNextThing = nextThing
  }

  if (previousHour !== h) {
    previousHour = h
    if ((present > 1) && !quiet && config.hourlyNotifications) {
      tts.speak(moment(today).format('h:mma'), {alert: true, bgm: false, volume: 0})
    } 
  }

  if (present > 2 && !playingMusic) {
    if ((Date.now() - presentSince)> 20000) {
      musicPlayer.playPlaylist(config.musicPlaylistUri)
      playingMusic = true
    }
  }

  if (present < 4) {
    var timeSince = Date.now() - lastPresentTime

    if (timeSince > config.goneTimeout) {
      if (present !==0) Logger.log("PRESENT: 0. I am gone.")
      present = 0
    } else if (timeSince > config.awayTimeout) {
      if (present !==1) Logger.log("PRESENT: 1. I am away.")
      musicPlayer.stop()
      playingMusic = false
      presentSince = Date.now()
      present = 1
    } else if (timeSince > config.presenceTimeout) {
      if (present !==2) Logger.log("PRESENT: 2. I am a little away.")
      present = 2
    }
  }
}

function getApperel(degrees) {
  if (degrees > config.appearalDegrees.hoodie) {
    return "t-shirt"
  } else if (degrees <= config.appearalDegrees.hoodie && degrees > config.appearalDegrees.jacket) {
    return "hoodie"
  } else if (degrees <= config.appearalDegrees.jacket && degrees > config.appearalDegrees.heavyJacket) {
    return "jacket"
  } else if (degrees <= config.appearalDegrees.heavyJacket && degrees > config.appearalDegrees.fullWinter) {
    return "heavy jacket"
  } else if (degrees <= config.appearalDegrees.fullWinter) {
    return "heavy jacket with a hat and gloves"
  }
}

function setPresent() {
  // console.log("quiet: " + quiet)
  // console.log("previousNextThing: " + previousNextThing)
  // console.log("dayMilestones: " + dayMilestones)

  if (present !== 3 && present !== 4) {
    presentSince = Date.now()
  }

  if (!wakeGreeting) {
    var textArray = []
    textArray.push('Good morning.')
    textArray.push('<break length="x-strong"/>')
    textArray.push(`It's ` + moment().format('h:mm') + `, on ` + moment().format('dddd, MMMM Do'))
    textArray.push('<break length="x-strong"/>')
    // It's a freezing 5 degrees
    textArray.push(`It's ` + Math.round(weatherData.currently.apparentTemperature) + ` degrees.`)
    textArray.push('<break length="x-strong"/>')
    textArray.push(`It's a lot colder than yesterday.`)
    textArray.push(`Make sure to wear a ` + getApperel(weatherData.currently.apparentTemperature))
    textArray.push('<break length="x-strong"/>')
    // but, it will rise to 10 degrees in the day
    textArray.push(`It will be ` + weatherData.hourly.summary)
    textArray.push('<break length="x-strong"/>')
    textArray.push(`This week, ` + weatherData.daily.summary)
    textArray.push('<break length="x-strong"/>')
    textArray.push('<break length="x-strong"/>')
    textArray.push('<break length="x-strong"/>')
    textArray.push(`Have a great day!`)

    tts.speak(textArray.join('\n\n'), {alert: true, bgm: true, volume: 7, playnews: true}, musicPlayer)
    wakeGreeting = true
  }

  // 3 = totally present
  // 2 = away for more than 2 minutes
  // 1 = firmly away for more than 1 hour
  // 0 = gone for more than 3 hours
  if (present !== 3) {
    Logger.log("I AM PRESENT!!!!")
    switch (present) {
      case 2:
        // just a little away.
        // do nothing.
        break
      case 1:
        // away.
        // say the time
        if (!quiet) tts.speak("Welcome back.\n\nIt's " + moment().format('h:mma'), {alert: true, bgm: false, volume: 0})
        break
      case 0:
        // was gone
        // say full welcome back
        if (!quiet) {
          var bedTimeHour
          dayMilestones.forEach(function(v){if (v[0] == 'Bed time') {bedTimeHour = (v[1])}})
          var timeUntil = moment.duration(moment().hour(bedTimeHour).minute(0).diff(moment(), 'minutes', true), 'minutes').humanize()
          var text = `Welcome home.\n\n\n\n\n\n\n\nIt's ` + moment().format('h:mma') + `.\n ` + timeUntil + ` until bedtime!\n\nThere are a couple new shows on Hulu. The Daily Show and Adventure Time.\n\nLet's have a great night!`
          tts.speak(text, {alert: true, bgm: true, volume: 7, playnews: true}, musicPlayer)
        } 
        break
    }
  } else {
    // Still present.
    // Logger.log("I AM STILL PRESENT. Boring.")
  }
  present = 4
  lastPresentTime = Date.now()
}

init()