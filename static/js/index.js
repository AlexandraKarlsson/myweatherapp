'use strict';

(function(){
    
    const SMHIURL = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/16.158/lat/58.5812/data.json';
    
    axios.get(SMHIURL)
        .then(function (response) {
            console.log(response.status); /*200 för att det gick rätt*/
            console.log(response.data); /*skriva in json */
            filterResponse(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

})();

/* TODO: */

function filterResponse(data) {
    
    var todaysWeather = null;
    var tomorrowsWeather = null;
    /*Filtrera ut idag 6, 12, 18 */
    /*Filtrera ut imorgon 6, 12, 18 */
    /*Filtrera ut parametrarna jag behöver*/
}

function uppdateDOM(todaysWeather, tomorrowsWeather) {
    /* uppdatera dagens väder*/
    /* uppdatera morgondagens väder*/
}