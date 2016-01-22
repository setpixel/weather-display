const config = {
  version: '0.0.1',
  forecast: { // Get a Forecast.io account: https://developer.forecast.io/ (Best weather api)
    apiKey: 'XXX__INSERTYOURKEYHERE__XXX',
    lat: '40.723228', // Look up your lat long: http://www.latlong.net/
    long: '-73.995614',
    checkInterval: 5*60*1000, // 5 minutes
  },
  ivona: { // Get an Ivona account for text to speech: https://www.ivona.com/ Sign up, get an api key and secret 
    accessKey: 'XXX__INSERTYOURKEYHERE__XXX',
    secretKey: 'XXX__INSERTYOURKEYHERE__XXX'
  },
  dayMilestones: [
    ["Sunrise", 6], // You can change the hours, or even add new ones.
    ["Wake up", 8],
    ["Breakfast", 9],
    ["Work", 10],
    ["Lunch",12],
    ["Sunset", 8+12],
    ["Get ready for bed", 12+10.5],
    ["Bed time", 12+11]
  ],
  appearalDegrees: {
    hoodie: 64, // Anything belore this number (in F) is that.
    jacket: 55, 
    heavyJacket: 45, 
    fullWinter: 30
  },
  hostname: 'raspberrypi', // If your Raspberry Pi hostname is something else, change it.
  port: process.env.PORT || 3000,
  logLevel: 0,
  presenceTimeout: 2*60*1000, // Light away after 2 minutes
  awayTimeout: 35*60*1000, // Definitate away after 35 minutes
  goneTimeout: 3*60*60*1000, // Gone after 3 hours
  gpioPin: 13, // Pin 13 for the data from the PIR sensor
  hourlyNotifications: true,
  mopidyAddress: 'ws://10.0.1.37:6680/mopidy/ws/',
  newsPodcastUri: 'podcast+http://www.npr.org/rss/podcast.php?id=500005',
  musicPlaylistUri: 'spotify:user:setpixel:playlist:0P2T0VBhivKnAjqEwXJkmG',
}

module.exports = config