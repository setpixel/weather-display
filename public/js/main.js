;(function() {
  'use strict';

  var weatherData;
  var skycons = new Skycons({"color": "white"});
  skycons.play();
  var clockInterval;
  var CHECKTIME = 2;

  var whiteColor = [255,255,255];

  var dayMilestones;
  var appearalDegrees;

  var getApparel = function(degrees){
    if (degrees > 64) {
      return "t-shirt";
    } else if (degrees <= 64 && degrees > 55) {
      return "hoodie";
    } else if (degrees <= 55 && degrees > 45) {
      return "jacket";
    } else if (degrees <= 45) {
      return "heavy jacket";
    }
  };

  var loadAPICall = function(force) {
    console.log("get data")
    $.ajax({
      url: "http://localhost:3000/api/weather",
      type: 'GET',
      success: function (data) {
        weatherData = window.weatherData = data.weather;
        dayMilestones = data.dayMilestones;
        appearalDegrees = data.appearalDegrees;
        //console.log(data);
        renderWeatherData();
        return data;
      }    
    });
    setTimeout(function(){loadAPICall(true)}, CHECKTIME * 60 * 1000);
  };

  var renderWeatherData = function() {
    console.log("RENDERWEATHERDATA")
    renderCurrent();
    renderClock();
    clearInterval(clockInterval);
    clockInterval = setInterval(function(){renderClock()}, 1000);
    renderDay();
    renderWeek();
  }

  var renderCurrent = function() {
    $("#current_temp").html(Math.round(weatherData.currently.apparentTemperature));
    skycons.set("current_condition_icon", weatherData.currently.icon);

    //
    

    var lowestTemp = 500;
    var highestPrecipProb = 0;
    highestPrecipProb = weatherData.currently.precipProbability;

    for (var i = 0; i < 4; i++) {
      lowestTemp = Math.min(lowestTemp, weatherData.hourly.data[i].apparentTemperature);
      highestPrecipProb = Math.max(highestPrecipProb, weatherData.hourly.data[i].precipProbability);
    }

    console.log(highestPrecipProb)
    var currentTextString = "";
    currentTextString += "A little colder. <br>";
    currentTextString += "Wear a " + getApparel(lowestTemp) + ". ";
    if (lowestTemp > 32 && highestPrecipProb > 0.65) {
      currentTextString += "Maybe bring an umbrella. ";
    }
    //currentTextString += "<br>";

    if (weatherData.currently.time < weatherData.daily.data[0].apparentTemperatureMaxTime) {
      currentTextString += "Rising to " + Math.round(weatherData.daily.data[0].apparentTemperatureMax) + "º by " + formatTime(weatherData.daily.data[0].apparentTemperatureMaxTime);
    } else if (weatherData.currently.time < weatherData.daily.data[1].apparentTemperatureMinTime) {
      currentTextString = currentTextString + "Falling to " + Math.round(weatherData.daily.data[1].apparentTemperatureMin) + "º by " + formatTime(weatherData.daily.data[1].apparentTemperatureMinTime);
    }    
    currentTextString = currentTextString + ". <br>" + weatherData.hourly.summary
    $("#today_text").html(currentTextString);




  };

  var renderDay = function() {
    var ctx = $("#graph_day")[0].getContext("2d");

    ctx.clearRect ( 0 , 0 , ctx.canvas.width , ctx.canvas.height );


    // ctx.fillStyle = "red";
    // ctx.rect(0,0,ctx.canvas.width, ctx.canvas.height);
    // ctx.fill();



// apparentTemperature: 83 ***
// cloudCover: 0.1 ***
// dewPoint: 63.3
// humidity: 0.54
// icon: "clear-day" ***
// ozone: 300.42
// precipIntensity: 0 ***
// precipProbability: 0 ***
// pressure: 1021.13
// summary: "Clear"
// temperature: 81.7
// time: 1409072400 ***
// visibility: 10
// windBearing: 130
// windSpeed: 1.46

    var maxTemp = 0;
    var minTemp = 500;

    var currentDay = new Date(weatherData.hourly.data[0].time*1000).getDate();
    var dayOffset = 0;

    var previousSun;

    for(var i = 0; i < weatherData.hourly.data.length; i++) {
      maxTemp = Math.max(maxTemp, weatherData.hourly.data[i].apparentTemperature);
      minTemp = Math.min(minTemp, weatherData.hourly.data[i].apparentTemperature);
      var x = (i/(weatherData.hourly.data.length-1))*ctx.canvas.width;
      ctx.fillStyle = "rgba(0,255,255," + (weatherData.hourly.data[i].precipProbability*0.8) + ")";
      ctx.fillRect(x,0,Math.ceil(ctx.canvas.width/weatherData.hourly.data.length), ctx.canvas.height);
      ctx.fillStyle = "rgba(0,0,0," + Math.round((Math.pow(weatherData.hourly.data[i].cloudCover,2)*0.3)*20)/20 + ")";
      ctx.fillRect(x,0,Math.ceil(ctx.canvas.width/weatherData.hourly.data.length), ctx.canvas.height);
      ctx.fillStyle = "rgba(50,50,100,0.2)";
      if (new Date(weatherData.hourly.data[i].time*1000).getDate() !== currentDay ) {
        dayOffset++;
      }
      currentDay = new Date(weatherData.hourly.data[i].time*1000).getDate();
      if ((weatherData.hourly.data[i].time > weatherData.daily.data[dayOffset].sunriseTime) && (weatherData.hourly.data[i].time < weatherData.daily.data[dayOffset].sunsetTime)) {
        var sunUp = true;
      } else {
        var sunUp = false;
      }
      if (!sunUp) {
        ctx.fillRect(x,0,Math.ceil(ctx.canvas.width/weatherData.hourly.data.length), ctx.canvas.height);
      }

      if (sunUp && (sunUp !== previousSun) && (typeof previousSun != 'undefined')) {
        var x = (i/(weatherData.hourly.data.length-1))*ctx.canvas.width;        
        ctx.beginPath();
        ctx.moveTo(x, 0)
        ctx.lineTo(x, ctx.canvas.height);
        ctx.strokeStyle = 'rgb(' + whiteColor[0] + ',' + whiteColor[1] + ',' + whiteColor[2] + ')';

        ctx.lineWidth = 1;
        ctx.fillStyle = 'rgba(' + whiteColor[0] + ',' + whiteColor[1] + ',' + whiteColor[2] + ',0.1)';
        ctx.stroke();

      }
      previousSun = sunUp;
    }

    var scale = (maxTemp - minTemp)

    var pts = [];





    for(var i = 0; i < weatherData.hourly.data.length; i++) {
      var x = (i/(weatherData.hourly.data.length-1))*ctx.canvas.width;
      var y = ctx.canvas.height-((weatherData.hourly.data[i].apparentTemperature-minTemp)/scale)*(ctx.canvas.height*0.7)- (ctx.canvas.height*0.15);
      pts.push(x);
      pts.push(y);
    }

    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1])
    ctx.curve(pts, 0.5, 20);
    ctx.fillStyle = 'rgba(' + whiteColor[0] + ',' + whiteColor[1] + ',' + whiteColor[2] + ',0.2)';
    ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
    ctx.lineTo(0, ctx.canvas.height);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1])
    ctx.curve(pts, 0.5, 20);
    ctx.strokeStyle = 'rgba(' + whiteColor[0]*0.8 + ',' + whiteColor[1]*0.8 + ',' + whiteColor[2]*0.8 + ',1)';

    ctx.lineWidth = 8;
    ctx.fillStyle = 'rgba(' + whiteColor[0] + ',' + whiteColor[1] + ',' + whiteColor[2] + ',0.01)';
    ctx.stroke();


    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1])
    ctx.lineTo(ctx.canvas.width, pts[1]);
    ctx.strokeStyle = 'rgba(' + whiteColor[0] + ',' + whiteColor[1] + ',' + whiteColor[2] + ',0.3)';
    ctx.lineWidth = 1;
    //ctx.setLineDash([10, 5])
    ctx.fillStyle = 'rgba(' + whiteColor[0] + ',' + whiteColor[1] + ',' + whiteColor[2] + ',0.1)';
    ctx.stroke();


    for(var i = 1; i < weatherData.hourly.data.length-1; i++) {
      var x = (i/(weatherData.hourly.data.length-1))*ctx.canvas.width;
      var y = ctx.canvas.height-((weatherData.hourly.data[i].apparentTemperature-minTemp)/scale)*(ctx.canvas.height*0.7)- (ctx.canvas.height*0.15);
      if (["9am", "12pm", "3pm", "6pm", "9pm", "12am"].indexOf(formatTime(weatherData.hourly.data[i].time)) > -1) {
        ctx.fillStyle = 'rgba(' + whiteColor[0] + ',' + whiteColor[1] + ',' + whiteColor[2] + ',0.5)';
        ctx.font = "14px HelveticaT";
        ctx.fillText(formatTime(weatherData.hourly.data[i].time), x-10, ctx.canvas.height-10);      
        ctx.fillStyle = 'rgba(' + whiteColor[0] + ',' + whiteColor[1] + ',' + whiteColor[2] + ',0.8)';
        ctx.font = "14px HelveticaT";
        ctx.fillText(Math.round(weatherData.hourly.data[i].apparentTemperature) + "º", x-10, y-10);      
      }
      if (["9am"].indexOf(formatTime(weatherData.hourly.data[i].time)) > -1) {
        ctx.fillStyle = 'rgba(' + whiteColor[0] + ',' + whiteColor[1] + ',' + whiteColor[2] + ',1)';
        ctx.font = "20px HelveticaT";
        ctx.fillText(("Sunday Monday Tuesday Wednesday Thursday Friday Saturday").split(" ")[new Date(weatherData.hourly.data[i].time*1000).getDay()], x-30, 30);        
      }
    }
  }

  var renderWeek = function() {
    var string = "This week, ";

    var array = weatherData.daily.summary.split('');
    array[0] = array[0].toLowerCase();

    $("#thisweek_text").html(string + array.join(''));
  }

  var formatTime = function(time) {
    var date = new Date(time*1000);
    var post = "am";
    var h = date.getHours();
    if (h == 12) {
      post = "pm";
    } else if (h == 0) {
      post = "am";
      h = 12;
    } else if (h > 11) {
      post = "pm";
      h = h - 12;
    }
    var m = date.getMinutes();
    if (m == 0) {
      var string = h + post;
    } else {
      var string = h + ":" + pad(m, 2) + post;
    }
    return string;
  };

  var previousNextThing;
  var dimMode = 0;
  var previousDimMode = 0;

  var renderClock = function() {
    var today = new Date();
    var h = today.getHours();
    if (h == 0) {
      h = 12;
    } else if (h > 12) {
      h = h - 12;
    }
    var m = today.getMinutes();
    var string = h + ":" + pad(m, 2);

    $("#date").html(("SUN MON TUE WED THU FRI SAT").split(" ")[today.getDay()] + " " + (today.getMonth()+1) + "/" + today.getDate())
    $("#clock").html(string);

    var nextThing = 0;
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
    dayMilestones.sort(function(a, b){return a[1]-b[1]});
    for (var i = 0; i < dayMilestones.length; i++) {
      if ((today.getHours() + (today.getMinutes()/60) + (today.getSeconds()/60/60)) < dayMilestones[i][1]) {

        nextThing = i;
        break;
      } else {
        switch (dayMilestones[i][0]) {
          case "Sunrise":
            dimMode = 0;
            break;
          case "Sunset":
            dimMode = 1;
            break;
          case "Bed time":
            dimMode = 2;
            break;
        }
      }
    }

    if (previousDimMode !== dimMode) {
      switch (dimMode) {
        case 0:
          $("#shade").hide();
          $("#bg").toggleClass("sunset", false);
          $("#bg").toggleClass("night", false);
          whiteColor = [255,255,255];
          break;
        case 1:
          $("#bg").toggleClass("sunset", true);
          $("#bg").toggleClass("night", false);
          whiteColor = [255,200,200];
          // $("#shade").css("backgroundColor", "rgba(80,30,0,0.5)");
          // $("#shade").show();
          break;
        case 2:
          $("#bg").toggleClass("sunset", false);
          $("#bg").toggleClass("night", true);
          whiteColor = [40,0,0];
          // $("#shade").css("backgroundColor", "rgba(30,0,0,0.85)");
          // $("#shade").show();
          break;
      }
      skycons.color = 'rgb(' + whiteColor[0] + ',' + whiteColor[1] + ',' + whiteColor[2] + ')'
      previousDimMode = dimMode;
    }

    if (previousNextThing !== nextThing) {
      alert(10);
      previousNextThing = nextThing;
    }

    var targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()) 
    targetDate = (new Date(targetDate.getTime() + (dayMilestones[nextThing][1] * 60 * 1000 * 60)   ))
    var string = "<span class='contdown-label'>" + dayMilestones[nextThing][0] + " in </span>" + formatDuration(targetDate - today);
    $("#countdown").html(string);
  };

  var formatDuration = function(duration) {
    var h = Math.floor(duration/1000/60/60);
    var m = Math.floor((duration/1000/60)- (h*60));
    var s = Math.floor((duration/1000)-((h*60*60)+(m*60)));

    if (duration < (10*1000*60)) {
      return m + ":" + pad(s, 2);
    } else if (duration < (60*1000*60)){
      return pad(m, 2);
    } else {
      return h + ":" + pad(m, 2);
    }
  };

  var pad = function(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  };

  $(document).ready(function() {
    setTimeout(function() {
      console.log("sup")
      loadAPICall(true);
     }, 1400);
  });

  var alert = function(times) {
    if (!times) { times = 5 };
    flashScreen(times);
  }

  var flashScreen = function(times) {

    $("#bg").addClass("alert" );

    setTimeout(function() {
      $("#bg").removeClass("alert" );
    }, times*1000);
  }

  window.weather = {
    alert: alert,
  }
  
}).call(this);