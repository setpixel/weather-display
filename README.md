# Weather Display

The Weather Display shows you the weather at all times. It's a digital display that passively displays the weather. If you put it in an area of your home you can see at most times, you can simply glance in the direction of the display, and you'll see the weather.

Similar to clock on the wall, it's a single mode display. It just displays the weather. It doesn't cycle through other stuff. If you need to know the temperature, it will always be in the same place.

The design is simple and elegant, telling you what you need to know and not much more. It is white text set on a black background, so it will not emit much light, and it will go with any room.

It runs on a Raspberry Pi. With the right display, you can hook up all the wires and enclose the unit behind the monitor so that all you have to do is plug in the display, and it works.

It does some more smart stuff. After sunset, the display will cut it's blue channel for circadian lighting. After bed time, it will significantly dim, but still be readable. After midnight, the display will go to sleep.

There are also audio events. There is a PIR sensor -- a sensor to know if a person is in the room, and a knock sensor -- a sensor for small vibrations. 
  Wake up:
    When you wake up in the morning, it will read the weather to you, and play the NPR Hourly News Summary.

    LINK TO SAMPLE.MP3
  Every hour:
    If you are in the room, a lower volume audio event will trigger, with the time on the hour. '*Ding* 5 p.m.'
  When you get home:
    After long absense, if the PIR sensor detects you, it will welcome you home and tell you how much time you have before going to bed. 
  Go to bed:
    If you are awake, it will let you know 30 minutes before bed time, and tell you when it's bedtime.

  If at any time the sound is playing and you want it to stop, you can simply tap the monitor or table it's on, and it will just stop.

## TODO

[TODO.md](TODO.md)

## Objective


## Quick installation guide

  1. Be on rasbian jessie
  1. http://www.raspberrypi-spy.co.uk/2015/06/how-to-disable-wifi-power-saving-on-the-raspberry-pi/ because what in the ever loving fuck.
  2. Install chrome browser 44: https://www.raspberrypi.org/forums/viewtopic.php?t=121195
  3. sudo apt-get update
  sudo apt-get upgrade
  1. $ wget http://node-arm.herokuapp.com/node_latest_armhf.deb
once downloaded, install

$ sudo dpkg -i node_latest_armhf.deb
Check if node is successfully installed

$ node -v


  1. Clone or download the repo
  1. Get an ivona account
  1. Get a forecast account
  1. Look up your lat long: http://www.latlong.net/
  1. Install sox
  2. npm install
  3. npm start
