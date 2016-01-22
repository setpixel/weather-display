'use strict'

var config = require('./config')
var Logger = require('./logger')
var Mopidy = require("mopidy");

class MusicPlayer {

  constructor() {
    this.mopidy = new Mopidy({
      webSocketUrl: config.mopidyAddress,
      callingConvention: "by-position-or-by-name"
    })
  }

  playPodcast(uri) {
    var mopidy = this.mopidy
    mopidy.tracklist.clear().then(()=>{
      mopidy.library.browse({uri: uri }).then((result)=>{
        mopidy.tracklist.add({uri: result[0].uri}).then((e)=>{
          Logger.log(`Playing news podcast`)
          mopidy.playback.play()
        })
      })
    })
  }

  playPlaylist(uri) {
    var mopidy = this.mopidy
    mopidy.tracklist.clear().then(()=>{
      mopidy.tracklist.add({uri: uri}).then((result)=>{
        mopidy.tracklist.shuffle().then(()=>{
          Logger.log(`Playing music playlist`)
          mopidy.playback.play()
        })
      })
    })
  }

  stop() {
    var mopidy = this.mopidy
    Logger.log(`Stopping music`)
    mopidy.playback.stop()
  }

}

module.exports = MusicPlayer