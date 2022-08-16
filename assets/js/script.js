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
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    console.log(searchHistory);

    // Assigning API to a const
    const apiKey = "a7e23bc489228e96c2f6406575ab7f8f";

    function getWeather(city) {
        // Current weather request
        let queryURL = "https//api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
        fetch(queryURL)
        .then(function(response) {
            console.log(response);

            // Display current weather
            const currentDate = new Date(response.formData.dt*1000);
            console.log(currentDate);
            const day = currentDate.getDate();
            const month = currenDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
            let weatherPic = response.data.weather[0].icon;
            picEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            picEl.setAttribute("alt", response.data.weather[0].description);
            tempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + "&#176F";
            humidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            windEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

            // UV index
            let lat = response.data.coord.lat;
            let lon = response.data.coord.lon;
            let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&long=" + lon + "&appid=" + apiKey + "&cnt=1";
            fetch(UVQueryURL)
                .then(function(response) {
                    let UVIndex = document.createElement("span");

                    if (response.data[0].value < 4) {
                        UVIndex.setAttribute("class", "badge badge-success");
                    }
                    else if (response.data[0].value < 8) {
                        UVIndex.setAttribute("class", "badge badge-warning");
                    }
                    else {
                        UVIndex.setAttribute("class", "badge badge-danger");
                    }
                    console.log(response.data[0].value)
                    UVIndex.innerHTML = response.data[0].value;
                    uvEl.innerHTML = "UV Index: ";
                    uvEl.append(UVIndex);
                });
        })
    }
}