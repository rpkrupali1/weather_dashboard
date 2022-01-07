//var city = "chicago";
var cityEl = document.querySelector("#city");
var tempEl = document.querySelector("#temp");
var windEl = document.querySelector("#wind");
var humidityEl = document.querySelector("#humidity");
var uvindexEl = document.querySelector("#uvindex");
var dailyForecastEl = document.querySelector("#dailyforecast");
var formEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#cityInput");
var todaysforcastEl = document.querySelector("#todaysforcast");
var cityHistory = {};

var getCurrentweather = function(city){
    var cityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=d1f59f196e4e712a80edcc818a784ec2";
    fetch(cityUrl).then(function(response){
        if(response.ok){
            var date = moment().format("MM/DD/YYYY");
            cityEl.textContent = city + " (" + date + ")";
            response.json().then(function(data){                
                lat = data.coord.lat;
                lon = data.coord.lon;
                getWeatherData(lat,lon);                                
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

var getWeatherData = function(lat,lon){
    var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=d1f59f196e4e712a80edcc818a784ec2&units=imperial";
    fetch(oneCallUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){                
                tempEl.textContent  = "Temp: " + data.current.temp + "°F";
                windEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
                humidityEl.textContent = "Humidity: " + data.current.humidity + " %";
                uvindexEl.textContent = "UV Index: " + data.current.uvi;
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
    
    for (let i = 0; i < 6; i++) {
        //create parent element to save weather forcast of that day
        var forcastCardEl = document.createElement("div");
        forcastCardEl.classList = "card d-flex m-2 p-2 bg-dark text-light";

        var dateEl = document.createElement("p")
        dateEl.textContent = moment.unix(data[i].dt).format("MM/DD/YYYY");
        dateEl.classList = "font-weight-bold";
        forcastCardEl.appendChild(dateEl);
        

        var tempEl = document.createElement("p");
        tempEl.textContent = "Temp: " + data[i].temp.day + "°F";
        //tempEl.classList = "col";
        forcastCardEl.appendChild(tempEl);

        var windEl = document.createElement("p");
        windEl.textContent = "Wind: " + data[i].wind_speed + " MPH";
        //windEl.classList = "col";
        forcastCardEl.appendChild(windEl);

        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + data[i].humidity + " %";
        //humidityEl.classList = "col";
        forcastCardEl.appendChild(humidityEl);

        dailyForecastEl.appendChild(forcastCardEl);
    }
}

var loadHistory = function(){
    
}

var formSubmitHandler = function(event){
    event.preventDefault();
    loadHistory();
    dailyForecastEl.textContent = "";
    cityEl.textContent = "";
    tempEl.textContent = "";
    windEl.textContent = "";
    humidityEl.textContent = "";
    uvindexEl.textContent = "";

    var city = cityInputEl.value.trim();
    if(city){
        getCurrentweather(city);
        city.value = "";
    }
    else
        alert("Please enter city name");
}

formEl.addEventListener("submit",formSubmitHandler)