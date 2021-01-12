// Declaring global variables

var now = dayjs();
var today = now.format("MM/DD/YYYY");
var city = ""; 
var searchList = []; 
var lsIndex = 0;
var lsFlag = true;
console.log("Today: ", today);

// The setPage function is used to initialize the page
setPage();

function setPage() {

    console.log("Inside set page");
    if (localStorage.getItem("city") !== null) {
        searchList = JSON.parse(localStorage.getItem('city'));
        console.log("local storage: ", searchList);        
        for (i = 0; i < searchList.length; i++) {               
           
            $("#search-history").append("<div class='row cityN'>"+ searchList[i] + "</div");            
            console.log("City: ", searchList[i]);
            city = searchList[i];
        }
        lsIndex = searchList.length; 
        console.log("Local Storage Index: ", lsIndex);
        citySearch(city); 
    }
}
// This function is used to get the weather data using city name ebtered by the user
function buildQueryURL(cityname) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?";
    var queryParams = { appid: "b0c91232e2976ef85bbb49769bd7a2b3" };

    queryParams.q = cityname;
    
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
   
    return queryURL + $.param(queryParams);
}
// Theis function updates the webpage with the Weather data for the selected city

function updatePage(WeatherData) {
    clear();
    console.log("Inside updatePage function");
    console.log(WeatherData);

    var $currentList = $("<ul>");
    $currentList.addClass("list-group");  
    $("#current-weather").append($currentList);
    var $currentListItem = $("<li>");
    $(".list-group").append($currentListItem);
    $currentListItem.append("<h4>" + city + " (" + today + ") " + "</h4>" + "<br>"); 

    var temperature = (WeatherData.current.temp - 273.15) * 1.80 + 32;
    temperature = temperature.toFixed(2) + '\xB0F';
    
    var $currentListItem = $("<li>");
    $(".list-group").append($currentListItem);
    $currentListItem.append("<h6> Temperature: " + temperature + "</h6>" + "<br>"); 

    var humidity = WeatherData.current.humidity + '%';
    
    var $currentListItem = $("<li>");
    $(".list-group").append($currentListItem);
    $currentListItem.append("<h6> Humidity: " + humidity + "</h6>" + "<br>"); 

    var speed = WeatherData.current.wind_speed + " MPH";
    
    var $currentListItem = $("<li>");
    $(".list-group").append($currentListItem);
    $currentListItem.append("<h6> Wind Speed: " + speed + "</h6>" + "<br>"); 

    var uvi = WeatherData.current.uvi;
    var $currentListItem = $("<li>");

    $(".list-group").append($currentListItem);
   
    // Setting background color and id for UV index depending on value

    if (uvi < 3) {
        
        $currentListItem.append("<h6> UV Index: " + "<span id='uvig'>" + uvi + "</span>" + "</h6>" + "<br>"); 
        
        uvColor = "green";
    }
    else if (uvi > 7) {
        $currentListItem.append("<h6> UV Index: " + "<span id='uvir'>" + uvi + "</span>" + "</h6>" + "<br>"); 
        uvColor = "red";
    }
    else {
        $currentListItem.append("<h6> UV Index: " + "<span id='uviy'>" + uvi+ "</span>" + "</h6>" + "<br>"); 
        uvColor = "yellow";
    }     
    // adding 5 day forecast

    for (i = 1; i < 6; i++) {

        var now = dayjs();
        var $forecastEl = $("<div>");
        $forecastEl.addClass("col-md-2 weather"); 
        $("#five-day").append($forecastEl);
        
        var d1 = now.add(i, 'day');
        var newDate = d1.format('MM/DD/YYYY');
        
        $forecastEl.append("<h6>" + newDate + "</h6>"); 
        
        var iconCode = WeatherData.daily[i].weather[0].icon;
        
        var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        
        var $imgEl = $("<img>");
        $forecastEl.append($imgEl);
        $imgEl.attr("src", iconurl);

        temperature = (WeatherData.daily[i].temp.day - 273.15) * 1.80 + 32;
        temperature = temperature.toFixed(2) + '\xB0F';
        
        $forecastEl.append("<p> Temp: " + temperature + "</p>"); 
        humidity = WeatherData.daily[i].humidity + '%';        
        $forecastEl.append("<p> Humidity " + humidity + "</p>");         
    }
    // Add current city to local storage if it doesn't exist

        if (lsFlag) {
            if (localStorage.getItem("city") === null) {
                searchList.push(city);
                var citystr = JSON.stringify(searchList)
                localStorage.setItem("city", citystr);
            }
            else {
                var citystr = JSON.parse(localStorage.getItem("city"));                    
                citystr.push(city);
                citystr = JSON.stringify(citystr);
                localStorage.setItem("city", citystr);
            }    
            $("#search-history").append("<div class='row cityN'>" + city + "</div"); 
            $(".cityN").on("click", function (event) {
                console.log("Event Listner added");     
                event.preventDefault();    
    
                console.log(event.target);  
                console.log(event.target.innerHTML);
    
                var cityname = event.target.innerHTML;        
                 citySearch(cityname);
            })
    }
}
// This function clears the page of any old data

function clear() {
    console.log("Inside clear function");

    $("#current-weather").empty();
    $("#five-day").empty();   
  
}
// This function is triggered when the user clicks on serach button

function citySearch(cityname) {
    clear(); 
    console.log("lsFlag: ", lsFlag);

    if (localStorage.getItem("city") !== null) {
        searchList = JSON.parse(localStorage.getItem('city'));
            
        for (i = 0; i < searchList.length; i++) {
            console.log("comparing: ", cityname, " and ", searchList[i]);           
            if (cityname === searchList[i]) {
                console.log("city name exists");
                lsFlag = false;
                break; 
                
            }
            else {
                console.log("city name doens't exists");
                lsFlag = true;
            }
        }
    }    
    var queryURL = buildQueryURL(cityname);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (WeatherData) {
        console.log(typeof WeatherData);   
        if (typeof WeatherData !== 'object') {
            alert("hello")
        }

        city = WeatherData.name;
        // console.log("City: ", city, "(", today,);
       
        var lon = WeatherData.coord.lon;
        // console.log("longitude: ", lon);

        var lat = WeatherData.coord.lat;
        // console.log("lattitude: ", lat);

        var queryURL = "https://api.openweathermap.org/data/2.5/onecall?";
        var queryParams = { appid: "b0c91232e2976ef85bbb49769bd7a2b3" };
        queryParams.lon = lon;
        queryParams.lat = lat;

        var queryURLall = queryURL + $.param(queryParams);
        console.log("------------------------------------");
        console.log("QueryURLall", queryURLall);

        $.ajax({
            url: queryURLall,
            method: "GET"
        }).then(updatePage)
    });
}
// Event listner for serach button.    
$("#run-search").on("click", function () {
    
    
    var cityname = $("#search-term")
        .val()
        .trim();
    
    if (cityname.toLowerCase() === city.toLowerCase()) {
        console.log("city name not changed");
        return;
    }
    else {
        clear();
    }
    citySearch(cityname);
    

});
// Event listner for clear all button

$("#clear-all").on("click", function () {
    console.log("inside local storage clear function");
    localStorage.clear();
    location.reload();
});
// Event listner for cities in search history

$(".cityN").on("click", function (event) {
    clear(); 
    event.preventDefault();    
    
    console.log(event.target);  
    console.log(event.target.innerHTML);
    
    var cityname = event.target.innerHTML;    
    
    citySearch(cityname);
    
}); 
