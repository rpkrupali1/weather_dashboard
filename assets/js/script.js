var cityEl = document.querySelector("#city");
var tempEl = document.querySelector("#temp");
var windEl = document.querySelector("#wind");
var humidityEl = document.querySelector("#humidity");
var uvindexEl = document.querySelector("#uvindex");
var dailyForecastEl = document.querySelector("#dailyforecast");
var formEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#cityInput");
var todaysforcastEl = document.querySelector("#todaysforcast");
var historyButtonsEl = document.querySelector("#history");
var currentWeatherIconEl = document.querySelector("#current-weather-icon");
//var dailyforecastHeaderEl = document.querySelector("#5dayforecast-header");

var getCurrentweather = function(city){
    var cityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=d1f59f196e4e712a80edcc818a784ec2";
    fetch(cityUrl).then(function(response){
        if(response.ok){
            saveCity(city);

            response.json().then(function(data){                
                lat = data.coord.lat;
                lon = data.coord.lon;
                getWeatherData(city,lat,lon);                                
            });
        }
        else{
            alert("Given city: " + city + " is invalid option. Please enter valid city name.");
            //todaysforcastEl.textContent = "";
        }
    })
    .catch(function(){
        alert("Something went wrong: Openweathermap might be down");
    })
}

var getWeatherData = function(city,lat,lon){
    var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=d1f59f196e4e712a80edcc818a784ec2&units=imperial";
    fetch(oneCallUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){ 

                var date = moment().format("MM/DD/YYYY");
                cityEl.textContent = city + " (" + date + ")";
                var iconUrl = "http://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png";
                var icon = document.createElement("img");
                icon.setAttribute("src", iconUrl);
                cityEl.appendChild(icon);

                tempEl.textContent  = "Temp: " + data.current.temp + "°F";
                windEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
                humidityEl.textContent = "Humidity: " + data.current.humidity + " %";
                
                uvindexEl.textContent = "UV Index: ";
                var uviVal = document.createElement("span");
                uviVal.classList = "bg-success px-1";
                uviVal.textContent = data.current.uvi;
                uvindexEl.appendChild(uviVal);

                var dailyData = data.daily;
                display5dayForecast(dailyData);
            });
        }
        else
            alert("Provided url: " + oneCallUrl + " is invalid ");
    })
    .catch(function(){
        alert("Something went wrong: Openweathermap might be down");
    })
}

var display5dayForecast = function(data){
    //dailyforecastHeaderEl.textContent = "5-day forecast:";
    var forecastRowEl = document.createElement("div");
    forecastRowEl.classList = "row";
    
    for (let i = 1; i < 6; i++) {
        //create parent element to save weather forcast of that day
        var forcastCardEl = document.createElement("div");
        forcastCardEl.classList = "card m-2 p-4 bg-dark text-light col-md";

        var dateEl = document.createElement("h3")
        dateEl.textContent = moment.unix(data[i].dt).format("M/D/YYYY");
        forcastCardEl.appendChild(dateEl);

        weatherIconDivEl = document.createElement("div");
        var weatherIconEl = document.createElement("img");
        var iconUrl = "http://openweathermap.org/img/w/" + data[i].weather[0].icon + ".png";
        weatherIconEl.setAttribute("src", iconUrl);
        weatherIconDivEl.appendChild(weatherIconEl)
        forcastCardEl.appendChild(weatherIconDivEl);        

        var tempEl = document.createElement("p");
        tempEl.textContent = "Temp: " + data[i].temp.day + "°F";
        forcastCardEl.appendChild(tempEl);

        var windEl = document.createElement("p");
        windEl.textContent = "Wind: " + data[i].wind_speed + " MPH";
        forcastCardEl.appendChild(windEl);

        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + data[i].humidity + " %";
        forcastCardEl.appendChild(humidityEl);

        forecastRowEl.appendChild(forcastCardEl);
        //dailyForecastEl.appendChild(forcastCardEl);
    }

    dailyForecastEl.appendChild(forecastRowEl);
}

var saveCity = function(city){
    var cityHistory = JSON.parse(window.localStorage.getItem("cities")) || [];
    var newCity = true;
    if(cityHistory){
        for (let i = 0; i < cityHistory.length; i++) {
            if(cityHistory[i]===city){
                newCity = false;
                break;
            }           
        }
    }

    if(newCity){
        cityHistory.push(city);
        localStorage.setItem("cities",JSON.stringify(cityHistory));
    }
}

var loadHistory = function(){
    var cityHistory = JSON.parse(window.localStorage.getItem("cities"));
    if(cityHistory){
        for (let i = 0; i < cityHistory.length; i++) {
            var cityHistoryEl  = document.createElement("button");
            cityHistoryEl.textContent = cityHistory[i];
            cityHistoryEl.id = cityHistory[i];
            cityHistoryEl.classList = "bg-secondary.bg-gradient rounded col-12 m-1";
            historyButtonsEl.appendChild(cityHistoryEl);
        }
    }
}

var clearContents = function(){
    dailyForecastEl.textContent = "";
    cityEl.textContent = "";
    tempEl.textContent = "";
    windEl.textContent = "";
    humidityEl.textContent = "";
    uvindexEl.textContent = "";
}


var formSubmitHandler = function(event){
    event.preventDefault();
    clearContents();
    var city = cityInputEl.value.trim();
    if(city){
        getCurrentweather(city);
        cityEl.value = "";
    }
    else
        alert("Please enter city name");
}

var buttonClickHandler = function(event){
    clearContents();
    var city = event.target.getAttribute("id");
    if(city){
        getCurrentweather(city);
        cityEl.value = "";
    }
}

loadHistory();
formEl.addEventListener("submit",formSubmitHandler)
historyButtonsEl.addEventListener("click", buttonClickHandler);

//icons http://openweathermap.org/img/w/10d.png