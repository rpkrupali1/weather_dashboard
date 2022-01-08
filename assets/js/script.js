var todaysforcastEl = document.querySelector("#todaysforcast"); //parent element to hold all current weather elements
var cityEl = document.querySelector("#city"); // city element of a  current weather
var tempEl = document.querySelector("#temp"); // temprature element for current weather
var windEl = document.querySelector("#wind"); // wind element for current weather
var humidityEl = document.querySelector("#humidity"); // humidity element for current weather
var uvindexEl = document.querySelector("#uvindex"); // uvindex element for current weather
var dailyForecastEl = document.querySelector("#dailyforecast"); // element to hold daily 2 days containers
var formEl = document.querySelector("#user-form"); // form element to search by city
var cityInputEl = document.querySelector("#cityInput"); // city input element
var historyButtonsEl = document.querySelector("#history"); //parent element to hold search history button elements
var currentWeatherIconEl = document.querySelector("#current-weather-icon"); // element to hold current weather icon
var forecastHeaderEl = document.querySelector("#forecast-header"); // element for 5 day forecast title

//initial function to get weather data
var getWeather = function(city){
    //get lattitude and longitude based on city
    var cityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=d1f59f196e4e712a80edcc818a784ec2";
    fetch(cityUrl).then(function(response){
        if(response.ok){
            saveCity(city);  //if city name is valid then save in local storage
            response.json().then(function(data){                
                lat = data.coord.lat;
                lon = data.coord.lon;
                getWeatherData(city,lat,lon);                                
            });
        }
        else{
            //alert when city name is incorrect
            alert("Given city: " + city + " is invalid option. Please enter valid city name."); 
        }
    })
    .catch(function(){
        //alert when openwethaer is down
        alert("Something went wrong: Openweathermap might be down");
    })
}

var getWeatherData = function(city,lat,lon){    
    var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=d1f59f196e4e712a80edcc818a784ec2&units=imperial";
    fetch(oneCallUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){ 
                todaysforcastEl.classList = "border border-secondary mb-4 px-2 row";  
                //Current day weather header              
                var date = moment().format("MM/DD/YYYY"); //get today's date using moment
                cityEl.textContent = city + " (" + date + ")";
                var iconUrl = "http://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png";
                var icon = document.createElement("img");
                icon.setAttribute("src", iconUrl);
                cityEl.appendChild(icon);

                tempEl.textContent  = "Temp: " + data.current.temp + "°F"; //current weather temprature
                windEl.textContent = "Wind: " + data.current.wind_speed + " MPH"; //current weather wind
                humidityEl.textContent = "Humidity: " + data.current.humidity + " %"; //current weather humidity
                
                //current weather uvindex and color code based on that
                uvindexEl.textContent = "UV Index: ";
                var uviVal = document.createElement("span");
                var uvi = data.current.uvi;;
                uviVal.textContent = uvi;
                if(uvi < 3)
                    uviVal.classList = "bg-success px-1";
                else if(uvi > 3 && uvi < 6)
                    uviVal.classList = "bg-warning px-1";
                else if(uvi > 6 && uvi < 8)
                    uviVal.classList = "bg-orange px-1";
                else if(uvi > 8 && uvi < 10)
                    uviVal.classList = "bg-danger px-1";
                else 
                    uviVal.classList = "bg-pink px-1";
                uvindexEl.appendChild(uviVal);

                var dailyData = data.daily;
                display5dayForecast(dailyData);
            });
        }
        else
            //alert when onecall url is incorrect
            alert("Provided url: " + oneCallUrl + " is invalid ");
    })
    .catch(function(){
        //alert when onecall weather api is down
        alert("Something went wrong: Openweathermap might be down");
    })
}

var display5dayForecast = function(data){
    forecastHeaderEl.textContent = "5-day forecast:";
    var forecastRowEl = document.createElement("div");
    forecastRowEl.classList = "row";
    // 5 day forecast 
    for (let i = 1; i < 6; i++) {
        //create parent element to save weather forcast of 5 day container
        var forcastCardEl = document.createElement("div");
        forcastCardEl.classList = "card m-2 p-4 bg-dark text-light col-md";

        // forecast date
        var dateEl = document.createElement("h3")
        dateEl.textContent = moment.unix(data[i].dt).format("M/D/YYYY");
        forcastCardEl.appendChild(dateEl);

        //forecast icon
        weatherIconDivEl = document.createElement("div");
        var weatherIconEl = document.createElement("img");
        var iconUrl = "http://openweathermap.org/img/w/" + data[i].weather[0].icon + ".png";
        weatherIconEl.setAttribute("src", iconUrl);
        weatherIconDivEl.appendChild(weatherIconEl)
        forcastCardEl.appendChild(weatherIconDivEl);        

        //forecast temp
        var tempEl = document.createElement("p");
        tempEl.textContent = "Temp: " + data[i].temp.day + "°F";
        forcastCardEl.appendChild(tempEl);

        //forecast wind
        var windEl = document.createElement("p");
        windEl.textContent = "Wind: " + data[i].wind_speed + " MPH";
        forcastCardEl.appendChild(windEl);

        //forecast humidity
        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + data[i].humidity + " %";
        forcastCardEl.appendChild(humidityEl);

        forecastRowEl.appendChild(forcastCardEl);
    }

    dailyForecastEl.appendChild(forecastRowEl);
}

//save city information in location storage
var saveCity = function(city){
    var cityHistory = JSON.parse(window.localStorage.getItem("cities")) || [];
    var newCity = true;
    if(cityHistory){
        //if city history exist then check if city information is already there or not
        for (let i = 0; i < cityHistory.length; i++) {
            if(cityHistory[i]===city){
                newCity = false;
                break;
            }           
        }
    }
    if(newCity){
        //if city information is new then only store add in local storage
        cityHistory.push(city);
        localStorage.setItem("cities",JSON.stringify(cityHistory));
    }
}

// load city data from local storage to search history
var loadHistory = function(){
    var cityHistory = JSON.parse(window.localStorage.getItem("cities"));
    if(cityHistory){
        for (let i = 0; i < cityHistory.length; i++) {
            var cityHistoryEl  = document.createElement("button");
            cityHistoryEl.textContent = cityHistory[i];
            cityHistoryEl.id = cityHistory[i];
            cityHistoryEl.classList = "bg-secondary.bg-gradient rounded col-12 m-1 text-capitalize";
            historyButtonsEl.appendChild(cityHistoryEl);
        }
    }
}

// clear data 
var clearContents = function(){
    dailyForecastEl.textContent = "";
    cityEl.textContent = "";
    tempEl.textContent = "";
    windEl.textContent = "";
    humidityEl.textContent = "";
    uvindexEl.textContent = "";
    forecastHeaderEl.textContent = "";
    todaysforcastEl.classList = "";
}

var formSubmitHandler = function(event){
    event.preventDefault();
    clearContents();
    var city = cityInputEl.value.trim();
    if(city){
        getWeather(city);
        cityEl.value = "";
    }
    else
        alert("Please enter city name");
}

var buttonClickHandler = function(event){
    clearContents();
    var city = event.target.getAttribute("id");
    if(city){
        getWeather(city);
        cityEl.value = "";
    }
}

loadHistory();
formEl.addEventListener("submit",formSubmitHandler)
historyButtonsEl.addEventListener("click", buttonClickHandler);