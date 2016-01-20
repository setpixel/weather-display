// http://www.npr.org/rss/podcast.php?id=452538242



var Ivona = require('ivona-node/');
var ivona = new Ivona({
    accessKey: 'GDNAIRKQP4TPESHDXYSA',
    secretKey: 'pBK7jGwtirVGCtTPSCFb/Pi13yVDNsgLuUArTVh6'
});
 
//ivona.listVoices().on('complete', function(voices) {
//    console.log(voices);
//});
 
    //  ivona.createVoice(text, config) 
    //  [string] text - the text to be spoken 
    //  [object] config (optional) - override Ivona request via 'body' value 

 
 
 

   //dinner stuff to watch podcasts
   
   var text = `<prosody rate="+10%" pitch="+10%">Good morning.</prosody> <prosody rate="+10%">It's 5:43, on Monday, January 18th.\nIt's 10 degrees.\nIt's a lot colder than yesterday. <prosody rate="+10%">Make sure to wear a heavy jacket.</prosody> It will be partly cloudy starting tomorrow morning, continuing until tomorrow afternoon.\nThis week, mixed precipitation on Friday through Sunday, with temperatures rising to 47°F on Monday.</prosody>`

   var text = `<prosody rate="+10%">It's 10 p.m.\n\nTime to go to bed.</prosody>`
   
 var TTS = require('./tts') 
 tts = new TTS();
 tts.speak("Time to get ready for bed. It's " + moment().format('h:mma') + ". ", {alert: true, bgm: false, volume: 0})
 tts.processing
 tts.speaking

 tts.speak(`<prosody rate="+10%">It's 10 p.m.\n\nTime to go to bed.</prosody>`)
 
  var text = `<prosody rate="+10%">Welcome home.\n\n\n\n\n\n\n\nIt's 7:55pm.\n 2 and a half hours until bedtime!\n\n\There are a couple new shows on Hulu. The Daily Show and Adventure Time.\n\n\Let's have a great night!` 
  
var text = `<prosody rate="+10%">Latest news from Gawker\n\n\n\nSt. Paul Police Sergeant Accused of Encouraging Drivers to Run Over Black Lives Matter Protestors\n\nA St. Paul police sergeant has been placed on administrative leave, Fox 9 News reports, after being accused of telling drivers, in a Facebook post, to run over Black Lives Matter protestors.<break length="x-strong"/>\n\nOhio Police Officer Killed After Suspect's Ex-Girlfriend Warned Dispatchers He Was "Looking to Kill a Cop"\n\nA police officer in Knox County was killed in the line of duty late Sunday night, WCMH-TV reports, after dispatchers received a call, late on Sunday night, from a woman who said her ex-boyfriend, Herschel Ray Jones, had left her house, with a gun, intending to kill a cop.<break length="x-strong"/>\n\nFamily of Rogue CIA Contractor Thought to Be Held by Iran Feels "Betrayed" By Obama Administration\n\nThe family of Robert Levinson, who disappeared from Iran’s Kish Island, in 2007, while working for rogue CIA analysts, learned of the recent prisoner exchange just like everybody else—from the news.<break length="x-strong"/>\n\nRNC Cuts Ties With NBC, Cries Over Wet Pee-Pee Diap\n\nSeeking more hard-hitting questions, the Republican National Committee has decided to pull February’s “Super Tuesday” debate from NBC News, CNN Money reported, and will partner with CNN instead. The RNC debate committee voted unanimously to end NBC’s involvement.` 

   var text = `11 p.m.`
  
  var text = `<prosody rate="+10%">Welcome home.\n\n\n\n\n\n\n\nIt's 7:55pm.\n 2 and a half hours until bedtime!\n\n\There are a couple new shows on Hulu. The Daily Show and Adventure Time.\n\n\Let's have a great night!` 


 var text = `<prosody rate="+10%" pitch="+10%">Good morning.</prosody> <prosody rate="+10%">It's 9:30, on Tuesday, January 19th. <break length="x-strong"/>\n\n It's 5 degrees.\n\nIt's a lot colder than yesterday. <prosody rate="+10%">Make sure to wear a heavy jacket.</prosody><break length="x-strong"/>\n\n It will be Clear throughout the day.\n\n\n\n\n\n\n\nThis week, snow (11–17 in.) on Friday through Sunday, with temperatures rising to 44°F on Tuesday.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nHave a great day!</prosody>`
 tts.speak(text)


    ivona.createVoice(text, {
        body: {
            voice: { gender: 'Female', language: 'en-GB', name: 'Amy' },
            parameters: {
                volume: 'x-loud',
                rate: 'medium',
                sentenceBreak  : 600,
                paragraphBreak : 1200
            },
            input: {
                type: 'application/ssml+xml'
            }
        }
    }).pipe(fs.createWriteStream('text.mp3')).on('finish', () => {
    child_process.execSync('sox silencebefore.wav text.mp3 silence.wav textdelay.mp3')
    child_process.execSync('sox -m cchord2.wav textdelay.mp3 happygit2.wav new.mp3  trim 0 `soxi -D textdelay.mp3`')
    child_process.execSync('sox new.mp3 new2.mp3 t fade 0 `soxi -D new.mp3` 0:05')

    child_process.execSync('play new2.mp3 gain +7');

})

    
