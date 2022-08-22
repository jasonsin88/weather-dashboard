function initPage() {
    const inputEl = document.getElementById("city-input");
    const searchEl = document.getElementById("search-button");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const picEl = document.getElementById("current-pic");
    const tempEl = document.getElementById("temperature");
    const humidityEl = document.getElementById("humidity");
    const windEl = document.getElementById("wind-speed");
    const uvEl = document.getElementById("UV-index");
    const historyEl = document.getElementById("history");
    const fivedayEl = document.getElementById("fiveday-header");
    const todayweatherEl = document.getElementById("today-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    console.log(searchHistory);

    // Assigning API to a const
    const APIKey = "adb85d2d309feb999ab13075f332ff75";

    function getWeather(cityName) {
        // Current weather request
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        fetch(queryURL)
        .then((response) => response.json())
        .then(function(data) {
            console.log(data);
            todayweatherEl.classList.remove("d-none");

            // Display current weather
            const currentDate = new Date(data.dt * 1000);
            console.log(currentDate);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            nameEl.innerHTML = data.name + " (" + month + "/" + day + "/" + year + ") ";
            let weatherPic = data.weather[0].icon;
            picEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            picEl.setAttribute("alt", data.weather[0].description);
            tempEl.innerHTML = "Temperature: " + k2c(data.main.temp) + "&#8451";
            humidityEl.innerHTML = "Humidity: " + data.main.humidity + "%";
            windEl.innerHTML = "Wind Speed: " + data.wind.speed + " MPH";

            // UV index
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            console.log(lat, lon);
            let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
            fetch(UVQueryURL)
            .then((response) => response.json())
            .then(function(data) {
                console.log(data);
                let UVIndex = document.createElement("span");

                if (data[0].value < 4) {
                    UVIndex.setAttribute("class", "badge badge-success");
                }
                else if (data[0].value < 8) {
                    UVIndex.setAttribute("class", "badge badge-warning");
                }
                else {
                     UVIndex.setAttribute("class", "badge badge-danger");
                }
                console.log(data[0].value)
                UVIndex.innerHTML = data[0].value;
                uvEl.innerHTML = "UV Index: ";
                uvEl.append(UVIndex);
            });

            // 5 day forecast
            let cityID = data.id;
            let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
            fetch(forecastQueryURL)
                .then((response) => response.json())
                .then(function(data) {
                    console.log(data);
                    fivedayEl.classList.remove("d-none");
                    const forecastEls = document.querySelectorAll(".forecast");
                    for (i=0; i < forecastEls.length; i++) {
                        forecastEls[i].innerHTML = "";
                        const forecastIndex = i*8 + 4;
                        const forecastDate = new Date(data.list[forecastIndex].dt * 1000);
                        const forecastDay = forecastDate.getDate();
                        const forecastMonth = forecastDate.getMonth() + 1;
                        const forecastYear = forecastDate.getFullYear();
                        const forecastDateEl = document.createElement("p");
                        forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                        forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                        forecastEls[i].append(forecastDateEl);

                        const forecastWeatherEl = document.createElement("img");
                        forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
                        forecastWeatherEl.setAttribute("alt", data.list[forecastIndex].weather[0].description);
                        forecastEls[i].append(forecastWeatherEl);
                        const forecastHumidityEl = document.createElement("p");
                        forecastHumidityEl.innerHTML = "Humidity: " + data.list[forecastIndex].main.humidity + "%";
                        forecastEls[i].append(forecastHumidityEl);
                    }
                })
        });
    }

    searchEl.addEventListener("click",function() {
        const searchTerm = inputEl.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    clearEl.addEventListener("click", function() {
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
    })

    function k2c(K) {
        return Math.floor(K - 273.15);
    }

    function renderSearchHistory() {
        historyEl.innerHTML = "";
        for(let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function() {
                getWeather(historyItem.value);
            })
            historyEl.append(historyItem);
        }
    }

    renderSearchHistory();
        if(searchHistory.length > 0) {
            getWeather(searchHistory[searchHistory.length - 1]);
        }    
}

initPage();