const config = {
  version: '0.0.1',
  forecast: {
    apiKey: 'XXX__INSERTURKEYSHEREYO__XXX',
    lat: '40.723228', // Soho, New York City
    long: '-73.995614',
    checkInterval: 5*60*1000, // 5 minutes
  },
  ivona: {
    accessKey: 'XXX__INSERTURKEYSHEREYO__XXX',
    secretKey: 'XXX__INSERTURKEYSHEREYO__XXX'
  },
  dayMilestones: [
    ["Sunrise", 6], 
    ["Wake up", 8],
    ["Breakfast", 9],
    ["Work", 10],
    ["Lunch",12],
    ["Sunset", 8+12],
    ["Get ready for bed", 12+10.5],
    ["Bed time", 12+11]
  ],
  appearalDegrees: {
    hoodie: 64, 
    jacket: 55, 
    heavyJacket: 45, 
    fullWinter: 30
  },
  port: process.env.PORT || 3000,
  logLevel: 0,
  presenceTimeout: 2*60*1000, // 2 minutes
  awayTimeout: 35*60*1000, // 35 minutes
  goneTimeout: 3*60*60*1000, // 3 hours
  gpioPin: 13,
}

module.exports = config
