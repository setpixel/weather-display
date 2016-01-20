# Weather Display

The Weather Display shows you the weather at all times. It's a digital display that passively displays the weather. If you put it in an area of your home you can see at most times, you can simply glance in the direction of the display, and you'll see the weather.

Similar to clock on the wall, it's a single mode display. It just displays the weather. It doesn't cycle through other stuff. If you need to know the temperature, it will always be in the same place.

The design is simple and elegant, telling you what you need to know and not much more. It is white text set on a black background, so it will not emit much light, and it will go with any room.

It runs on a Raspberry Pi. With the right display, you can hook up all the wires and enclose the unit behind the monitor so that all you have to do is plug in the display, and it works.

It does some more smart stuff. After sunset, the display will cut it's blue channel for circadian lighting. After bed time, it will significantly dim, but still be readable. After midnight, the display will go to sleep.

There are also audio events. There is a PIR sensor -- a sensor to know if a person is in the room, and a knock sensor -- a sensor for small vibrations. 
  Wake up:
    When you wake up in the morning, it will read the weather to you, and play the NPR Hourly News Summary.

    [Hear a sample of what plays when you enter the room in the morning](https://www.dropbox.com/s/btc129m90bbj6ul/sample.mp3?dl=0)
    
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
1. Disable wifi power saving because FUCK YOU http://www.raspberrypi-spy.co.uk/2015/06/how-to-disable-wifi-power-saving-on-the-raspberry-pi/ because what in the ever loving fuck.
1. Install chrome browser 44. TO THE GUY WHO MADE THIS POSSIBLE, I KISS YOU ON THE MOUTH https://www.raspberrypi.org/forums/viewtopic.php?t=121195
1. sudo apt-get update
1. sudo apt-get upgrade
1. sudo apt-get remove nodejs
1. Download latest node $ wget http://node-arm.herokuapp.com/node_latest_armhf.deb
once downloaded, install
$ sudo dpkg -i node_latest_armhf.deb
$ node -v
1. npm install gpio
1. might need to install wiringpi
1. git clone https://github.com/setpixel/weather-display.git
1. cd weather-display
1. npm install
1. rename config-sample.js to config.js
1. Get an ivona account
1. Get a forecast account
1. Look up your lat long: http://www.latlong.net/
1. edit config file
1. Install sox
1. sudo apt-get install libsox-fmt-mp3
1. npm install
1. sudo npm start (NEED TO BE SUDO FOR GPIO STUFF)

Optional:

1. disable leds
2. set up to boot into weather display
  1. sudo apt-get install matchbox-window-manager
  1. cp /etc/xdg/lxsession/LXDE-pi/autostart /home/pi/.config/lxsession/LXDE-pi/autostart
  1. sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart
  1. paste in:
  #@lxpanel --profile LXDE-pi
#@pcmanfm --desktop --profile LXDE-pi
#@xscreensaver -no-splash
@xset s off
@xset -dpms
@xset s noblank
@chromium-browser --kiosk --incognito http://localhost:3000
  1. edit crontab
3. Edit crontab to turn display on in the morning and off at late night
  crontab -e

  # m h  dom mon dow   command
@reboot sleep 6 && cd ~/git/weather-display && sudo npm start
0 7 * * * tvservice -p && fbset -depth 16
0 23 * * * tvservice -o

