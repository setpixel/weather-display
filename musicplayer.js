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

    this.playing = false
    this.volume = 100
  }

  playPodcast(uri) {
    var mopidy = this.mopidy

    this.volume = 100
    mopidy.mixer.setVolume({volume: this.volume})

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

    this.volume = 100
    mopidy.mixer.setVolume({volume: this.volume})

    mopidy.tracklist.clear().then(()=>{
      mopidy.tracklist.add({uri: uri}).then((result)=>{
        mopidy.tracklist.shuffle().then(()=>{
          Logger.log(`Playing music playlist`)
          mopidy.playback.play()
          this.playing = true
        })
      })
    })
  }

  stop() {
    var mopidy = this.mopidy
    Logger.log(`Stopping music`)
    mopidy.playback.stop()
    this.playing = false
  }

  fadeDown(steps, ms, downTo) {
    var mopidy = this.mopidy
    if (!steps) steps = 5
    if (!ms) ms = 500
    if (!downTo) downTo = 20

    mopidy.mixer.getVolume().then((e)=>{
      this.volume = e
      for (var i = 1; i <= steps; i++) {
        var volumeChunks = (this.volume - downTo) / steps
        var volume = Math.round(this.volume - (volumeChunks * i))
        //console.log(volume, (ms/steps)*i)
        setTimeout(function(){
          mopidy.mixer.setVolume({volume: Number(this)})
        }.bind(volume), (ms/steps)*i)
      }
    })
  }

  fadeUp(steps, ms, to) {
    var mopidy = this.mopidy
    if (!steps) steps = 10
    if (!ms) ms = 500
    if (to) this.volume = to

    mopidy.mixer.getVolume().then((e)=>{
      for (var i = 1; i <= steps; i++) {
        var volumeChunks = Math.abs(this.volume - e) / steps
        var volume = Math.round(e + (volumeChunks * i))
        //console.log(volume, (ms/steps)*i)
        setTimeout(function(){
          mopidy.mixer.setVolume({volume: Number(this)})
        }.bind(volume), (ms/steps)*i)
      }
    })
  }

}

module.exports = MusicPlayer