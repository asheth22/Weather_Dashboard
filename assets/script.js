var now = dayjs();
var today = now.format("MM/DD/YYYY");
var city; 
var searchList = []; 
console.log("Today: ", today);

setPage();

function setPage() {

    console.log("Inside set page");
    if (localStorage.getItem("city") !== null) {
        searchList = JSON.parse(localStorage.getItem('city'));
        console.log("local storage: ", searchList);
        var $cityList = $("<ul>");
        $cityList.addClass("city-list");  
        $("#search-history").append($cityList);
        for (i = 0; i < searchList.length; i++) {     
            console.log("Inside setpage for loop");
            var $cityListItem = $("<li>");
            $cityListItem.addClass("cityL")
            $(".city-list").append($cityListItem);
            $cityListItem.append("<h4>"+ searchList[i] + "</h4"); 
            console.log("City: ", searchList[i]);
        }
    }
}

// $(".city").on("click", clearSearch)

function buildQueryURL(cityname) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?";
    var queryParams = { appid: "b0c91232e2976ef85bbb49769bd7a2b3" };

    queryParams.q = cityname;
    
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
   
    return queryURL + $.param(queryParams);
}

function updatePage(WeatherData) {

    console.log("Inside updatePage function");
    console.log(WeatherData);

    var $currentList = $("<ul>");
    $currentList.addClass("list-group");  
    $("#current-weather").append($currentList);
    var $currentListItem = $("<li>");
    $(".list-group").append($currentListItem);
    $currentListItem.append("<h3>" + city + " (" + today + ") " + "</h3>" + "<br>"); 

    var temperature = (WeatherData.current.temp - 273.15) * 1.80 + 32;
    temperature = temperature.toFixed(2) + '\xB0F';
    console.log("Temperature: ", temperature);
    var $currentListItem = $("<li>");
    $(".list-group").append($currentListItem);
    $currentListItem.append("<h4> Temperature: " + temperature + "</h4>" + "<br>"); 

    var humidity = WeatherData.current.humidity + '%';
    console.log("Humidity: ", humidity);
    var $currentListItem = $("<li>");
    $(".list-group").append($currentListItem);
    $currentListItem.append("<h4> Humidity: " + humidity + "</h4>" + "<br>"); 

    var speed = WeatherData.current.wind_speed + " MPH";
    console.log("Wind Speed: ", speed);
    var $currentListItem = $("<li>");
    $(".list-group").append($currentListItem);
    $currentListItem.append("<h4> Wind Speed: " + speed + "</h4>" + "<br>"); 

    var uvi = WeatherData.current.uvi;
    var $currentListItem = $("<li>");

    $(".list-group").append($currentListItem);
   
    var uvColor;
    if (uvi < 3) {
        
        $currentListItem.append("<h4> UV Index: " + "<span id='uvig' style=background-color:green;>" + uvi + "</span>" + "</h4>" + "<br>"); 
        
        uvColor = "green";
    }
    else if (uvi > 7) {
        $currentListItem.append("<h4> UV Index: " + "<span id='uvir' style=background-color:red;>" + uvi + "</span>" + "</h4>" + "<br>"); 
        uvColor = "red";
    }
    else {
        $currentListItem.append("<h4> UV Index: " + "<span id='uviy' style=background-color:yellow;>" + uvi + "</span>" + "</h4>" + "<br>"); 
        uvColor = "yellow";
    }
    console.log("UV Indes: ", uvi, uvColor);
    

    for (i = 1; i < 6; i++) {

        var now = dayjs();
        var $forecastEl = $("<div>");
        $forecastEl.addClass("col-md-2 weather"); 
        $("#five-day").append($forecastEl);
        
        var d1 = now.add(i, 'day');
        var newDate = d1.format('MM/DD/YYYY');
        
        console.log("-------------------------------------------------------");

        console.log("New Date: ", newDate);
        $forecastEl.append("<h6>" + newDate + "</h6>"); 
        
        var iconCode = WeatherData.daily[i].weather[0].icon;
        console.log("icon: ", iconCode);
        var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        console.log("iconURL: ", iconurl);
        var $imgEl = $("<img>");
        $forecastEl.append($imgEl);
        $imgEl.attr("src", iconurl);

        temperature = (WeatherData.daily[i].temp.day - 273.15) * 1.80 + 32;
        temperature = temperature.toFixed(2) + '\xB0F';
        console.log("Temperature: ", temperature);
        $forecastEl.append("<p> Temp: " + temperature + "</p>"); 

        humidity = WeatherData.daily[i].humidity + '%';
        console.log("Humidity: ", humidity);
        console.log("Clouds: ", WeatherData.daily[i].weather[0].description);
        $forecastEl.append("<p> Humidity " + humidity + "</p>" + "<br>"); 
        
    }
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
}

function clear() {
    console.log("Inside clear function");

    $("#current-weather").empty();
    $("#five-day").empty();   
  
}

function citySearch() {
    // $("#cityinfo").empty();
    clear();

    // Build the query URL for the ajax request to the NYT API
    var cityname = $("#search-term")
    .val()
    .trim();
    var queryURL = buildQueryURL(cityname);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (WeatherData) {
        console.log(WeatherData);
        console.log("------------------------------------");

        city = WeatherData.name;
        console.log("City: ", city, "(", today,);
       
        var lon = WeatherData.coord.lon;
        console.log("longitude: ", lon);

        var lat = WeatherData.coord.lat;
        console.log("lattitude: ", lat);

        console.log("------------------------------------");

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

    //  .on("click") function associated with the clear button
$("#run-search").on("click", citySearch);
// $("#clear-all").on("click", clearSearch);
