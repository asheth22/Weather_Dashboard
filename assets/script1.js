/**
 * pulls information from the form and build the query URL
 * @returns {string} URL for NYT API based on form inputs
 */
function buildQueryURL() {

    // This is our API key
    // var APIKey = "b0c91232e2976ef85bbb49769bd7a2b3";

    // Here we are building the URL we need to query the database
    // var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
    //   "q=Bujumbura,Burundi&appid=" + APIKey;
    // queryURL is the url we'll use to query the API
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?";
    
    // lat = { lat } & lon={ lon }& exclude={ part }& appid={ API key } "
    // Begin building an object to contain our API call's query parameters
    // Set the API key
    var queryParams = { appid: "b0c91232e2976ef85bbb49769bd7a2b3"};
  
    // Grab text the user typed into the search input, add to the queryParams object
    queryParams.q = $("#search-term")
      .val()
      .trim();
  
    // Logging the URL so we have access to it for troubleshooting
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
}
  
function getall() {
    var queryURlall = "https://api.openweathermap.org/data/2.5/onecall?"
}
  
  /**
   * takes API data (JSON/object) and turns it into elements on the page
   * @param {object} WeatherData - object containing NYT API data
   */
  function updatePage(WeatherData) {
    
  
    // Log the WeatherData to console, where it will show up as an object
    console.log(WeatherData);
    console.log("------------------------------------");
  
    
    var temperature = (WeatherData.main.temp - 273.15) * 1.80 + 32;
    console.log("Temperature: ", temperature);
      
    var humidity = WeatherData.main.humidity + '%';
    console.log("Humidity: ", humidity);
      
    var speed = WeatherData.wind.speed + " MPH";
    console.log("Wind Speed: ", speed);  
    
      
    //   // Increase the articleCount (track article # - starting at 1)
    //   var articleCount = i + 1;
  
    //   // Create the  list group to contain the articles and add the article content for each
    //   var $articleList = $("<ul>");
    //   $articleList.addClass("list-group");
  
    //   // Add the newly created element to the DOM
    //   $("#article-section").append($articleList);
  
    //   // If the article has a headline, log and append to $articleList
    //   var headline = article.headline;
    //   var $articleListItem = $("<li class='list-group-item articleHeadline'>");
  
    //   if (headline && headline.main) {
    //     console.log(headline.main);
    //     $articleListItem.append(
    //       "<span class='label label-primary'>" +
    //         articleCount +
    //         "</span>" +
    //         "<strong> " +
    //         headline.main +
    //         "</strong>"
    //     );
    //   }
  
    //   // If the article has a byline, log and append to $articleList
    //   var byline = article.byline;
  
    //   if (byline && byline.original) {
    //     console.log(byline.original);
    //     $articleListItem.append("<h5>" + byline.original + "</h5>");
    //   }
  
    //   // Log section, and append to document if exists
    //   var section = article.section_name;
    //   console.log(article.section_name);
    //   if (section) {
    //     $articleListItem.append("<h5>Section: " + section + "</h5>");
    //   }
  
    //   // Log published date, and append to document if exists
    //   var pubDate = article.pub_date;
    //   console.log(article.pub_date);
    //   if (pubDate) {
    //     $articleListItem.append("<h5>" + article.pub_date + "</h5>");
    //   }
  
    //   // Append and log url
    //   $articleListItem.append("<a href='" + article.web_url + "'>" + article.web_url + "</a>");
    //   console.log(article.web_url);
  
    //   // Append the article
    //   $articleList.append($articleListItem);
    // }
  }
  
  // Function to empty out the articles
  function clear() {
    $("#current-weathe").empty();
  }
  
  // CLICK HANDLERS
  // ==========================================================
  
  // .on("click") function associated with the Search Button
  $("#run-search").on("click", function(event) {
    
    event.preventDefault();   
    clear();
  
    // Build the query URL for the ajax request to the NYT API
    var queryURL = buildQueryURL();
  
   
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(getall);
  });
  
  //  .on("click") function associated with the clear button
  $("#clear-all").on("click", clear);
  