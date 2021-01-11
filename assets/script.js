var now = dayjs();
var today = now.format("MM/DD/YYYY");
var city; 
var searchList = []; 
var lsIndex = 0;
var lsFlag = true;
console.log("Today: ", today);

setPage();

function setPage() {

    console.log("Inside set page");
    if (localStorage.getItem("city") !== null) {
        searchList = JSON.parse(localStorage.getItem('city'));
        console.log("local storage: ", searchList);        
        for (i = 0; i < searchList.length; i++) {               
           
            $("#search-history").append("<div class='row cityN'>"+ searchList[i] + "</div");            
            console.log("City: ", searchList[i]);        }
        lsIndex = searchList.length; 
        console.log("Local Storage Index: ", lsIndex);
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
   
    
    if (uvi < 3) {
        
        $currentListItem.append("<h6> UV Index: " + "<span id='uvig' style=background-color:green;>" + uvi + "</span>" + "</h6>" + "<br>"); 
        
        uvColor = "green";
    }
    else if (uvi > 7) {
        $currentListItem.append("<h6> UV Index: " + "<span id='uvir' style=background-color:red;>" + uvi + "</span>" + "</h6>" + "<br>"); 
        uvColor = "red";
    }
    else {
        $currentListItem.append("<h6> UV Index: " + "<span id='uviy' style=background-color:yellow;>" + uvi + "</span>" + "</h6>" + "<br>"); 
        uvColor = "yellow";
    }     

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
        $forecastEl.append("<p> Humidity " + humidity + "</p>" + "<br>");         
    }
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
function clear() {
    console.log("Inside clear function");

    $("#current-weather").empty();
    $("#five-day").empty();   
  
}
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
        console.log(WeatherData);        

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
   
$("#run-search").on("click", function () {
    clear();
    
    var cityname = $("#search-term")
        .val()
        .trim();
    citySearch(cityname);

});
$("#clear-all").on("click", function () {
    console.log("inside local storage clear function");
    localStorage.clear();
    location.reload();
});
// $(".cityN").on("click", function (event) {
//     event.preventDefault();    
    
//     console.log(event.target);  
//     console.log(event.target.innerHTML);
    
//     var cityname = event.target.innerHTML;    
//     // console.log("Current city name: ", $("#search-term").val().trim());
//     citySearch(cityname);
    
// }); 
$(".cityN").on("click", function (event) {
    event.preventDefault();    
    
    console.log(event.target);  
    console.log(event.target.innerHTML);
    
    var cityname = event.target.innerHTML;    
    // console.log("Current city name: ", $("#search-term").val().trim());
    citySearch(cityname);
    
}); 
