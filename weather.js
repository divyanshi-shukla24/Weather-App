let city = document.getElementById("city");
let type = document.getElementById("type");
let temp = document.getElementById("temp");
let image = document.getElementById("img");
let input = document.getElementById("inp");
let body = document.body;
let API_key = "befb5cc6f2ad6ab867fcb16e57104686";

// New elements for future weather forecast
let forecastContainer = document.createElement("div");
forecastContainer.className = "forecast-container";
document.querySelector(".container").appendChild(forecastContainer);

const getWeatherData = async (search) => {
    try {
        let getData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_key}&units=metric`);
        let jsonData = await getData.json();

        if (jsonData.cod === "404") {
            city.innerHTML = "City not found!";
            temp.innerHTML = "";
            type.innerHTML = "";
            image.src = "weather.png"; 
            body.style.backgroundColor = "black";
            forecastContainer.innerHTML = ""; // Clear forecast if city not found
            return;
        }

        city.innerHTML = jsonData.name;
        temp.innerHTML = Math.floor(jsonData.main.temp) + "°C";
        type.innerHTML = jsonData.weather[0].main;
        updateImageAndBackground(type.innerHTML);

        // Fetch and display future weather data
        let lat = jsonData.coord.lat;
        let lon = jsonData.coord.lon;
        getForecastData(lat, lon);

    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

const updateImageAndBackground = (weatherType) => {
    switch (weatherType) {
        case "Clouds":
            image.src = "https://images.unsplash.com/photo-1509803874385-db7c23652552?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdWQlMjBwbmd8ZW58MHx8MHx8fDA%3D";
            body.style.backgroundColor = "#B0C4DE"; // Light Steel Blue
            break;
        case "Clear":
            image.src = "https://img.freepik.com/free-photo/beautiful-road-going-through-farm-cornfield-with-tree-end-colorful-sky_181624-23214.jpg?t=st=1724480708~exp=1724484308~hmac=93d5a90b41829cd8923157b8ba05bd0fcc788e818918a5ddf08d665078146116&w=826";
            body.style.backgroundColor = "#87CEEB"; // Sky Blue
            break;
        // Other cases remain unchanged...
    }
}

const getForecastData = async (lat, lon) => {
    let forecastData = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${API_key}&units=metric`);
    let jsonData = await forecastData.json();

    forecastContainer.innerHTML = "<h3>5-Day Forecast:</h3>";

    // Loop through the next 5 days
    for (let i = 1; i <= 5; i++) {
        let dayData = jsonData.daily[i];
        let date = new Date(dayData.dt * 1000).toLocaleDateString();
        let temp = Math.floor(dayData.temp.day) + "°C";
        let weatherType = dayData.weather[0].main;

        forecastContainer.innerHTML += `<p>${date}: ${temp}, ${weatherType}</p>`;
    }
}

function myFun() {
    let search = input.value.trim();
    if (search !== "") {
        getWeatherData(search);
    }
}
