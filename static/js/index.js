
/* HOW TO USE:
    - Add axios support <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    - Add weather-widget script  <script src="static/js/index.js" type="text/javascript"></script>
    - Add wind-icon file ./static/media/arrowTransparent.jpg
    - Add div for the widget <div id="weather-widget"/>
*/

(function() {           //IIFE incapsle the code to avoid leakage into the global scope
    'use strict';
    
    //creating class responsible for the weatherparameters
    class WeatherParameters {   
    
        //constructor sets the variables to null
        constructor() {
            this.temp = null;
            this.wd = null;
            this.ws = null;
            this.wsymb2 = null;
            this.pmean = null;
        }
        
        //parse-method that loops through the parameterData to find and assign the value to the variables
        //it also checks if the value null, in that case it assign a string response 
        parse(parametersData) {
            parametersData.forEach(function(parameterData) {

                if(parameterData.name == "t") {
                    this.temp = (parameterData.values[0] !== null ? parameterData.values[0] : 'Missing value');
                }
                if(parameterData.name == "wd") {
                    this.wd = (parameterData.values[0] !== null ? parameterData.values[0] : 'Missing value');
                }
                if(parameterData.name == "ws") {
                    this.ws = (parameterData.values[0] !== null ? parameterData.values[0] : 'Missing value');
                }
                if(parameterData.name == "Wsymb2") {
                    this.wsymb2 = (parameterData.values[0] !== null ? parameterData.values[0] : 'Missing value');
                }
                if(parameterData.name == "pmean") {
                    this.pmean = (parameterData.values[0] !== null ? parameterData.values[0] : 'Missing value');
                }
            }, this);
        }
    
    }

    //creating class responsible for one days weather which includes three times of the day 6,12,18
    class DayWeather {
    
        constructor() {
            this.kl6 = null;
            this.kl12 = null;
            this.kl18 = null;
        }
        
        //parse-method which sets the hours to 6, 12, 18
        //then it loops through the data-array to find the right time of day
        //if it findes the correct time it creates an WeatherParameters object
        //and calls its parse-method and assign it to the class-variable
        parse(date, data) { 
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
    }
    
    //the array for the wsymb2 parameter which numeric value points to a string value
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
    
    
    //function that creates one row of table data and return it
    function createWeatherRow(time, weatherData) {
        
        //creates a DOM-element <tr> which will be returned when the function is called
        //creates DOM-element <td>, sets its innerHTML to a specific value from weatherData
        //
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
    
    
    //function that creates one table header and sets its innerHTML to the argument
    //then returns the th function call
    function createHeaderCell(header) {
        var th = document.createElement('th');
        th.innerHTML = header;
        return th;
    }
    
    //function that create the table row that contains the table headers for the
    //weather parameters, then returns the <tr>
    function createTableHeader() {
        var tr = document.createElement('tr');
        tr.appendChild(createHeaderCell('Tid'));
        tr.appendChild(createHeaderCell('Temp'));
        tr.appendChild(createHeaderCell('Vind'));
        tr.appendChild(createHeaderCell('Himmel'));
        tr.appendChild(createHeaderCell('Regn'));
        return tr;
    }
    
    //function which creates one weather table based on the weatherDay that is passed 
    //in to the function. It also sets the attribute for styling the table
    function createWeatherTable(weatherDay) {
        var weatherTable = document.createElement('table');
        weatherTable.setAttribute('style', 'border-spacing: 10px');
        weatherTable.appendChild(createTableHeader());
        
        //the if statements checks if the specified time has a value of null,
        //if it doesn't it calls the createWeatherRow function and append it to the table
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
    
    //function  that creates creates and inject the DOM elements into the <div> in the index.html 
    function createWidgetDOM(todaysWeather, tomorrowsWeather) {
        
        var containerDiv = document.querySelector('#weather-widget');
        
        /*Building widget content*/
        //calls the different functions to append the created tables into the containerDiv
        
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
    
    //const that store the url that will be used to get data from SMHIs open API in the format of JSON, 
    //also specifies the longitude and latitude for the weatherpoint
    const SMHIURL = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/16.158/lat/58.5812/data.json';
    
    //using axios to send the GET-request to the API, then (after receiving the response) it will run the anonymous function body 
    //if the response status is ok ex. 200, otherwise (in case of error status) it will run the other function that logs an error 
    //message to the console
    axios.get(SMHIURL)
        .then(function (response) { 
        
            //Creating two date-objects for today and tomorrow
            //Which will be used for fetching the correct weatherdata
            var todaysDate = new Date();
            var tomorrowsDate = new Date();
            tomorrowsDate.setDate(todaysDate.getDate() + 1);
            
            //Creating a DayWeather-object for today and call the parse-method to parse
            //the correct weatherdata to each table
            var today = new DayWeather();
            today.parse(todaysDate, response.data);
        
            var tomorrow = new DayWeather();
            tomorrow.parse(tomorrowsDate, response.data);
            
            //calling the function to append the tables to the DOM
            createWidgetDOM(today,tomorrow);
        })
        .catch(function (error) {
            console.log('Failed to access SMHIs open API');
        });
    

})();


