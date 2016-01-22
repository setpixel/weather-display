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

    setInterval(()=>this.getState().then(), 5000)
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
          this.playing = true
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
    var thisVolume = this.volume
    var promise = new Promise( function (resolve, reject) {
      mopidy.mixer.getVolume().then((e)=>{
        thisVolume = e
        for (var i = 1; i <= steps; i++) {
          var volumeChunks = (thisVolume - downTo) / steps
          var volume = Math.round(thisVolume - (volumeChunks * i))
          if (i == steps) {
            setTimeout(function(){
              mopidy.mixer.setVolume({volume: Number(this)}).then(()=>{
                resolve(true)
              })}.bind(volume), (ms/steps)*i)
          } else {
            setTimeout(function(){
              mopidy.mixer.setVolume({volume: Number(this)}).then(()=>{
              })}.bind(volume), (ms/steps)*i)
          }
        }
      })
    })
    return promise
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
        setTimeout(function(){
          mopidy.mixer.setVolume({volume: Number(this)})
        }.bind(volume), (ms/steps)*i)
      }
    })
  }

  getState() {
    var mopidy = this.mopidy
    var thisObj = this;
    var promise = new Promise( function (resolve, reject) {
      mopidy.playback.getState().then((e)=>{
        if (e !== 'playing') {
          thisObj.playing = false
        } else {
          thisObj.playing = true
        }
        resolve(thisObj.playing)
      })
    })
    return promise
  }

}

module.exports = MusicPlayer