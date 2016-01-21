# Weather Display (on Raspberry Pi / Node.js)

The Weather Display shows you the weather at all times. It's a digital display that passively displays the weather. If you put it in an area of your home you can see at most times, you can simply glance in the direction of the display, and you'll see the weather. It runs on a Raspberry Pi Zero, so it's also mad cheap!

![Weather Display detail](https://raw.githubusercontent.com/setpixel/weather-display/master/public/gfx/photos/detail.jpg)

Similar to clock on the wall, it's a single mode display. It just displays the weather. It doesn't cycle through other stuff. If you need to know the temperature, it will always be in the same place.

![Weather Display in room](https://raw.githubusercontent.com/setpixel/weather-display/master/public/gfx/photos/inroom.jpg)

The design is simple and elegant, telling you what you need to know and not much more. It is white text set on a black background, so it will not emit much light, and it will go with any room.

With the right display, you can hook up all the wires and enclose the unit behind the monitor so that all you have to do is plug in the display, and it works.

## But wait, theres more!

It does some more smart stuff. After sunset, the display will cut it's blue channel for circadian lighting. After bed time, it will significantly dim, but still be readable. After midnight, the display will go to sleep.

![Weather Display pir](https://raw.githubusercontent.com/setpixel/weather-display/master/public/gfx/photos/pirsensor.jpg)

It talks to you. And not in an annoying way like that Echo. There is a PIR sensor -- a sensor to know if a person is in the room, and a knock sensor -- a sensor for small vibrations. 

### Wake up knowing the weather

When you wake up in the morning, and step into the room with the weather display, it will read the weather to you, and play the NPR Hourly News Summary.

[Click here: Hear a sample of what plays when you enter the room in the morning](https://www.dropbox.com/s/btc129m90bbj6ul/sample.mp3?dl=0)
    
#### Minor audio events

Every hour, between wake and bedtime, if you are in the room, It will tell you the time: '*Ding* 5 p.m.'

On specific events, it will let you know that it's lunch time, when the sun is setting, get ready for bed, and bedtime.

### Welcome home

After long absense, if the PIR sensor detects you, it will welcome you home and tell you how much time you have before going to bed. 

## TODO

[TODO.md](TODO.md)

## Quick installation guide

The Weather Display is a breeze to install with only 21 easy steps. If you're a pro, feel free to skip random steps like I do all the time, and then shit definitely won't work.

1. Be on Rasbian Jessie. I built this on Wheezy and I had a horrible time getting GPIO libs to install. I just rebuilt everything on Jessie and it works super well.
1. Disable WiFi power saving because FUCK YOU WHOEVER THOUGHT THAT WAS A GOOD IDEA: http://www.raspberrypi-spy.co.uk/2015/06/how-to-disable-wifi-power-saving-on-the-raspberry-pi/
1. Install Chrome Browser 44. TO THE GUY WHO MADE THIS POSSIBLE, I KISS YOU ON THE MOUTH: https://www.raspberrypi.org/forums/viewtopic.php?t=121195
1. sudo apt-get update
1. sudo apt-get upgrade
1. sudo apt-get remove nodejs (Raspbian auto installs something called node red and it totally sucks)
1. Download latest node $ wget http://node-arm.herokuapp.com/node_latest_armhf.deb
1. $ sudo dpkg -i node_latest_armhf.deb
1. $ node -v (Should be like 5.4.2 or something)
1. might need to install wiringpi: http://wiringpi.com/download-and-install/ (Don't try to apt-get install or anything like that. It doesn't work)
1. $ npm install rpi-gpio (Should work, maybe, I had trouble with it)
1. git clone https://github.com/setpixel/weather-display.git
1. cd weather-display
1. npm install
1. Copy config-sample: $ cp config-sample.js config.js
1. Get an Ivona account for text to speech: https://www.ivona.com/ Sign up, get an api key and secret 
1. Get a Forecast.io account: https://developer.forecast.io/ (Best weather api)
1. Look up your lat long: http://www.latlong.net/
1. Edit config.js file. Add all that sweet shit in there.
1. Install sox: $ sudo apt-get install sox (Amazing linux audio command line tool)
1. $ sudo apt-get install libsox-fmt-mp3 (For MP3 stuffs)
1. $ sudo npm start (NEED TO BE SUDO FOR GPIO STUFF)

Optional:

1. Disable LEDs on Pi
2. Set up to boot into weather display
  1. $ sudo apt-get install matchbox-window-manager x11-xserver-utils unclutter
  1. $ cp /etc/xdg/lxsession/LXDE-pi/autostart /home/pi/.config/lxsession/LXDE-pi/autostart
  1. $ sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart
  1. Paste in:
```
#@lxpanel --profile LXDE-pi
#@pcmanfm --desktop --profile LXDE-pi
#@xscreensaver -no-splash
@xset s off
@xset -dpms
@xset s noblank
@chromium-browser --kiosk --incognito http://localhost:3000
@unclutter -idle 0.1 -root
```
  3. Edit crontab to turn display on in the morning and off at late night and start node when it boots!
    1. $ crontab -e
    2. Paste in something like: (7am turn on, 11pm/23:00 turn off)
```
# m h  dom mon dow   command
@reboot sleep 6 && cd ~/git/weather-display && sudo npm start > weatherlog.log
0 7 * * * tvservice -p && fbset -depth 16
0 23 * * * tvservice -o
```
