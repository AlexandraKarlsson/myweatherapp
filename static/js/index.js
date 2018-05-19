
/* HOW TO USE:
    - Add axios support <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    - Add weather-widget script  <script src="static/js/index.js" type="text/javascript"></script>
    - Add wind-icon file ./static/media/arrowTransparent.jpg
    - Add div for the widget <div id="weather-widget"/>
*/

(function() {
    'use strict';
    
        class WeatherParameters {
    
    constructor() {
        this.temp = null;
        this.wd = null;
        this.ws = null;
        this.wsymb2 = null;
        this.pmean = null;
    }
    
    parse(parametersData) {
        parametersData.forEach(function(parameterData) {
        
            if(parameterData.name == "t") {
                this.temp = parameterData.values[0];
                console.log('t = ' + parameterData.values[0]);
            }

            if(parameterData.name == "wd") {
                this.wd = parameterData.values[0];
                console.log('wd = ' + parameterData.values[0]);
            }
            
            if(parameterData.name == "ws") {
                this.ws = parameterData.values[0];
                console.log('ws = ' + parameterData.values[0]);
            }

            if(parameterData.name == "Wsymb2") {
                this.wsymb2 = parameterData.values[0];
                console.log('wsymb2 = ' + parameterData.values[0]);
            }

            if(parameterData.name == "pmean") {
                this.pmean = parameterData.values[0];
                console.log('pmean = ' + parameterData.values[0]);
            }
        }, this);
    }
    
    toString() {
        return "WeatherParameters[temp=" + this.temp + ",wd=" + this.wd + ",ws=" + this.ws + ",wsymb2=" + this.wsymb2 + ",pmean=" + this.pmean + "]";
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
        }, this); 
    }
    
    toString() {
        return "DayWeather[kl6=" + (this.kl6!==null?this.kl6.toString():"null") +
            ",kl12=" + (this.kl12!==null?this.kl12.toString():"null") +
            ",kl18=" + (this.kl18!==null?this.kl18.toString():"null") +"]";
    }
}
    
    const wsymb2Array = [
        'dummy',
        'Klart',//'Clear sky',
        'Halvklart',//'Nearly clear sky',
        'Växlande molnighet',//'Variable cloudiness',
        'Halvklart',//'Halfclear sky',
        'Molnigt',//'Cloudy sky',
        'Mulet',//'Overcast',
        'Dimmigt',//'Fog',
        'Lätta regnskurar',//'Light rain showers',
        'Måttliga regnskurar',//'Moderate rain showers',
        'Kraftiga regnskurar',//'Heavy rain showers',
        'Åska', //'Thunderstorm',
        'Snöblandat regn',//'Light sleet showers',
        'Måttligt snöblandat regn',//'Moderate sleet showers',
        'Kraftigt snöblandat regn', //'Heavy sleet showers',
        'Lätta snöbyar', //'Light snow showers',
        'Måttliga snöbyar', //'Moderate snow showers',
        'Kraftiga snöbyar', //'Heavy snow showers',
        'Lätt regn', //'Light rain',
        'Måttligt regn', //'Moderate rain',
        'Kraftigt regn', //'Heavy rain',
        'Åska', //'Thunder',
        'Lätt snö', //'Light sleet',
        'Måttlig snö', //'Moderate sleet',
        'Kraftig snö', //'Heavy sleet',
        'Lätt snöfall', //'Light snowfall',
        'Måttligt snöfall', //'Moderate snowfall',
        'Kraftigt snöfall' //'Heavy snowfall' 
    ];
    
    function createWeatherRow(time, weatherData) {
        
        
        var tr = document.createElement('tr');

        var td = document.createElement('td');
        td.innerHTML = time;
        tr.appendChild(td);

        var td = document.createElement('td');
        td.innerHTML = weatherData.temp;
        tr.appendChild(td);

        //Wind speed and direction

        var td = document.createElement('td');
        var div = document.createElement('div');
        div.setAttribute('style', 'display:flex');

        var img = document.createElement('img');
        img.setAttribute('src', './static/media/arrowTransparent.jpg');
        img.setAttribute('style', 'height: 20px; margin: 2px; transform: rotate(-' + weatherData.wd + 'deg');
        div.appendChild(img);

        var span = document.createElement('span');
        span.setAttribute('style', 'display: block; margin: auto; text-align: center');
        span.innerHTML = weatherData.ws;
        div.appendChild(span);

        //td.innerHTML = weatherData.wd + ' , ' + weatherData.ws;
        td.appendChild(div);
        tr.appendChild(td);

        var td = document.createElement('td');
        td.innerHTML = wsymb2Array[weatherData.wsymb2];
        tr.appendChild(td);

        var td = document.createElement('td');
        td.innerHTML = weatherData.pmean;
        tr.appendChild(td);

        return tr;
    }
    
    
    function createHeaderCell(header) {
        var th = document.createElement('th');
        th.innerHTML = header;
        return th;
    }
    
    function createTableHeader() {
        console.log('Enter the createtableHeader function');
        var tr = document.createElement('tr');
        tr.appendChild(createHeaderCell('Tid'));
        tr.appendChild(createHeaderCell('Temp'));
        tr.appendChild(createHeaderCell('Vind'));
        tr.appendChild(createHeaderCell('Himmel'));
        tr.appendChild(createHeaderCell('Regn'));
        return tr;
    }
    
    function createWeatherTable(weatherDay) {
        console.log('Enter the createWeatherTable function');
        var weatherTable = document.createElement('table');
        weatherTable.setAttribute('style', 'border-spacing: 10px');
        weatherTable.appendChild(createTableHeader());
        
        if(weatherDay.kl6 !== null) {
           weatherTable.appendChild(createWeatherRow('6', weatherDay.kl6));
        }
        if(weatherDay.kl12 !== null) {
           weatherTable.appendChild(createWeatherRow('12', weatherDay.kl12));
        }
        if(weatherDay.kl18 !== null) {
           weatherTable.appendChild(createWeatherRow('18', weatherDay.kl18));
        }
        return weatherTable;
    }
    

    function createWidgetDOM(todaysWeather, tomorrowsWeather) {
        
        console.log('Enter the createWidgetDOM function');
        
        var containerDiv = document.querySelector('#weather-widget');
        
        /*Building widget content*/
        
        var h1 = document.createElement('h1');
        h1.innerHTML = 'Väder';
        containerDiv.appendChild(h1);
        
        var h2Today = document.createElement('h2');
        h2Today.innerHTML = 'Idag';
        containerDiv.appendChild(h2Today);
        containerDiv.appendChild(createWeatherTable(todaysWeather));
        
        var h2Tomorrow = document.createElement('h2');
        h2Tomorrow.innerHTML = 'Imorgon';
        containerDiv.appendChild(h2Tomorrow);
        containerDiv.appendChild(createWeatherTable(tomorrowsWeather));
    }
    
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
        
            createWidgetDOM(today,tomorrow);
        })
        .catch(function (error) {
            console.log('Failed to access SMHIs open API');
        });
    

})();


