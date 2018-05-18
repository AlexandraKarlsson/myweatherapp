'use strict';

class WeatherParameters {
    
    constructor() {
        this.temp = null;
        this.wd = null;
        this.wsymb2 = null;
        this.pmean = null;
    }
    
    parse(parametersData) {
        parametersData.forEach(function(parameterData){
        
            if(parameterData.name == "t") {
                this.temp = parameterData.values[0];
                console.log('t = ' + parameterData.values[0]);
            }

            if(parameterData.name == "wd") {
                this.wd = parameterData.values[0];
                console.log('wd = ' + parameterData.values[0]);
            }

            if(parameterData.name == "Wsymb2") {
                this.wsymb2 = parameterData.values[0];
                console.log('wsymb2 = ' + parameterData.values[0]);
            }

            if(parameterData.name == "pmean") {
                this.pmean = parameterData.values[0];
                console.log('pmean = ' + parameterData.values[0]);
            }
        },this);
    }
    
    toString() {
        return "WeatherParameters[temp=" + this.temp + ",wd=" + this.wd + ",wsymb2=" + this.wsymb2 + ",pmean=" + this.pmean + "]";
    }
    
}

class DayWeather {
    
    constructor() {
        this.kl6 = null;
        this.kl12 = null;
        this.kl18 = null;
    }
    
    parse(date, data) { 
        //console.log("datum = " + date);
        var kl6 = new Date(date.getTime());
        kl6.setHours(6,0,0,0);
    
        var kl12 = new Date(date.getTime());
        kl12.setHours(12,0,0,0);
    
        var kl18 = new Date(date.getTime());
        kl18.setHours(18,0,0,0);
        
        data.timeSeries.forEach(function(timeData) {        
            var d = new Date(timeData.validTime);

            if(d.getTime() == kl6.getTime()) {
                var parameters = new WeatherParameters();
                parameters.parse(timeData.parameters);
                this.kl6 = parameters;
            }
            if(d.getTime() == kl12.getTime()) {
                var parameters = new WeatherParameters();
                parameters.parse(timeData.parameters);
                this.kl12 = parameters;
            }
            if(d.getTime() == kl18.getTime()) {
                var parameters = new WeatherParameters();
                parameters.parse(timeData.parameters);
                this.kl18 = parameters;
            }
        },this); 
    }
    
    toString() {
        return "DayWeather[kl6=" + (this.kl6!==null?this.kl6.toString():"null") +
            ",kl12=" + (this.kl12!==null?this.kl12.toString():"null") +
            ",kl18=" + (this.kl18!==null?this.kl18.toString():"null") +"]";
    }
}


(function() {
    
    const SMHIURL = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/16.158/lat/58.5812/data.json';
    
    axios.get(SMHIURL)
        .then(function (response) {
            console.log(response.status); /*200 för att det gick rätt*/
            /*console.log(response.data);*/ /*skriva in json */
            //console.log(response.data);
        
            var todaysDate = new Date();
            var tomorrowsDate = new Date();
            tomorrowsDate.setDate(todaysDate.getDate() + 1);
            
        
            var today = new DayWeather();
            today.parse(todaysDate, response.data);
            console.log("Today = " + today.toString());
        
            var tomorrow = new DayWeather();
            tomorrow.parse(tomorrowsDate, response.data);
            console.log("Tomorrow = " + tomorrow.toString());
        
            uppdateDOM(today,tomorrow);
        })
        .catch(function (error) {
            console.log(error);
        });

})();


function createWeatherRow(time, weatherData) {
    var tr = document.createElement('tr');
    
    var td = document.createElement('td');
    td.innerHTML = time;
    tr.appendChild(td);
    
    var td = document.createElement('td');
    td.innerHTML = weatherData.temp;
    tr.appendChild(td);
    
    var td = document.createElement('td');
    td.innerHTML = weatherData.wd;
    tr.appendChild(td);
    
    var td = document.createElement('td');
    td.innerHTML = weatherData.wsymb2;
    tr.appendChild(td);
    
    var td = document.createElement('td');
    td.innerHTML = weatherData.pmean;
    tr.appendChild(td);

    return tr;
}

function uppdateDOM(todaysWeather, tomorrowsWeather) {
    
    /* uppdatera dagens väder*/
    var todayTable = document.querySelector('#weather-today');
    
    if(todaysWeather.kl6 !== null) {
       todayTable.appendChild(createWeatherRow('6', todaysWeather.kl6));
    }
    if(todaysWeather.kl12 !== null) {
       todayTable.appendChild(createWeatherRow('12', todaysWeather.kl12));
    }
    if(todaysWeather.kl18 !== null) {
       todayTable.appendChild(createWeatherRow('18', todaysWeather.kl18));
    }

    
    /* uppdatera morgondagens väder*/
    var tomorrowTable = document.querySelector('#weather-tomorrow');
    
    if(tomorrowsWeather.kl6 !== null) {
       tomorrowTable.appendChild(createWeatherRow('6', tomorrowsWeather.kl6));
    }
    if(tomorrowsWeather.kl12 !== null) {
       tomorrowTable.appendChild(createWeatherRow('12', tomorrowsWeather.kl12));
    }
    if(tomorrowsWeather.kl18 !== null) {
       tomorrowTable.appendChild(createWeatherRow('18', tomorrowsWeather.kl18));
    }
    
    
    
}

function injectDOM() {
    
    
    
    
    
}




/*
function filterResponse(data) {
    
    var weatherData = [];
    
    //sätter tiderna som skall hämtas ut ur tidserien
    
    var kl6 = new Date();
    kl6.setHours(6,0,0,0);
    
    var kl12 = new Date();
    kl12.setHours(12,0,0,0);
    
    var kl18 = new Date();
    kl18.setHours(18,0,0,0);
    
    //går igenom arrayen timeSeries och loopar igenom för att hitta de specifika
    //tiderna, om de hittas anropar jag filtrering av parameterna och tilldelar 
    //arrayen weatherData
    
    data.timeSeries.forEach(function(timeData) {
        
        var d = new Date(timeData.validTime);
        
        if(d.getTime() == kl6.getTime()) {
            weatherData.push(selectParameters(timeData, kl6));
        }
        if(d.getTime() == kl12.getTime()) {
            weatherData.push(selectParameters(timeData, kl12));
        }
        if(d.getTime() == kl18.getTime()) {
            weatherData.push(selectParameters(timeData, kl18));
        }
    });
    

}
*/

/*
function selectParameters(dataObj, time) {
    
    //funktion som hämtar de specifika parametervärdena och tilldelar en array
    
    var weather = null;
    var temp;
    var wd;
    var wsymb2;
    var pmean;
    
    dataObj.parameters.forEach(function(item){
        
        if(item.name == "t") {
           temp = item.values[0];
            console.log('t = ' + item.values[0]);
        }
        
        if(item.name == "wd") {
           wd = item.values[0];
            console.log('wd = ' + item.values[0]);
        }
        
        if(item.name == "Wsymb2") {
           wsymb2 = item.values[0];
            console.log('wsymb2 = ' + item.values[0]);
        }
        
        if(item.name == "pmean") {
            pmean = item.values[0];
            console.log('pmean = ' + item.values[0]);
        }
    });
    
    weather = new Weather(time, temp, wd, wsymb2, pmean);
    console.log(weather.toString());
    

    
    costumData.forEach(function(item) {
         console.log(item);
    });
    
    return weather;
}
*/
