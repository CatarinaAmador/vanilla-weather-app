/////////////////////
// Global Variables //
/////////////////////

let weekDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
];

let units = "metric";
let apiKey = "0f2fe65450d1f47efc01eb6a5ed904a1";
let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
let apiForecastEndpoint = "https://api.openweathermap.org/data/2.5/forecast?"

let celsiusTemperature = null;

let temperature = document.querySelector("#current-temperature");
let unit = document.querySelector("#unit");

///////////////
// Functions //
///////////////

function updateDate(timestamp) {
  let currDate = new Date(timestamp);
  let weekDay = weekDays[currDate.getDay()];
  let hour = currDate.getHours();
  let min = currDate.getMinutes();

  if(hour < 10) {
      hour = `0${hour}`;
  }
  if(min < 10) {
     min = `0${min}`;
  }
  date = `${weekDay} ${hour}:${min}`;
  return date;
}

function getTime(timestamp) {
  let currDate = new Date(timestamp);
  let hour = currDate.getHours();
  let min = currDate.getMinutes();

  if(hour < 10) {
      hour = `0${hour}`;
  }
  if(min < 10) {
     min = `0${min}`;
  }

  time = `${hour}:${min}`;
  return time;
}

function updateForecast(response) {
  
  let count = 1;
  /* Getting forecast for 5 days at 3pm */
  for(let i = 5; i < 40; i = i + 8) {
    let date = new Date(response.data.list[i].dt * 1000);
    let currentForecast = `forecast${count}`;
    document.querySelector(`#${currentForecast} h4`).innerHTML = weekDays[date.getDay()]; /*Day of week*/
    document.querySelector(`#${currentForecast} .description`).innerHTML = response.data.list[i].weather[0].main; /* Brief description */  
    document.querySelector(`#${currentForecast} .max-temp`).innerHTML = Math.round(response.data.list[i].main.temp_max); /* Max Temperature */
    document.querySelector(`#${currentForecast} .min-temp`).innerHTML = Math.round(response.data.list[i-3].main.temp_max); /* Min Temperature */
    let icon = document.querySelector(`#${currentForecast} img`);
    icon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.list[i].weather[0].icon}@2x.png`);
  icon.setAttribute(
    "alt",
    `${response.data.list[i].weather[0].description}`);
    count++;
  }
}

function updateTemperature(response) {
  let currentCity = document.querySelector("#current-city");
  let currentDate = document.querySelector("#current-date");
  let weatherDetail = document.querySelector("#current-weather-detail");
  let currentHumidity = document.querySelector("#current-humidity");
  let currentWind = document.querySelector("#current-wind");
  let thermicFeeling = document.querySelector("#thermic-feeling");
  let pressure = document.querySelector("#pressure");
  let visibility = document.querySelector("#visibility");
  let sunrise = document.querySelector("#sunrise");
  let sunset = document.querySelector("#sunset");
  let icon = document.querySelector("#today-icon");

  celsiusTemperature = response.data.main.temp;
  unit.innerHTML = "ºC";
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  temperature.innerHTML = Math.round(response.data.main.temp);
  currentCity.innerHTML = `${response.data.name}`;
  currentDate.innerHTML = updateDate(response.data.dt * 1000);
  weatherDetail.innerHTML = `${response.data.weather[0].description}`;
  currentHumidity.innerHTML = `${response.data.main.humidity}%`;
  currentWind.innerHTML = `${Math.round(response.data.wind.speed)} Km/h`;
  thermicFeeling.innerHTML = `${Math.round(response.data.main.feels_like)}`;
  pressure.innerHTML = `${Math.round(response.data.main.pressure)}`;
  visibility.innerHTML = `${Math.round(response.data.visibility / 100)}`;
  sunrise.innerHTML = getTime(response.data.sys.sunrise * 1000);
  sunset.innerHTML = getTime(response.data.sys.sunset * 1000);
  icon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  icon.setAttribute(
    "alt",
    `${response.data.weather[0].description}`);
}

function updateCity(city) {
  let apiUrl = `${apiEndpoint}q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(updateTemperature);

  let apiUrlForecast = `${apiForecastEndpoint}q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrlForecast).then(updateForecast);
}

function searchInput(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input");
  updateCity(city.value);
}

function getTemperaturePosition(position) {
  let lat = Math.round(position.coords.latitude);
  let lon = Math.round(position.coords.longitude);
  let apiUrl = `${apiEndpoint}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(updateTemperature);
}

function getCurrentTemperature() {
  navigator.geolocation.getCurrentPosition(getTemperaturePosition);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9/5) + 32);
  temperature.innerHTML = fahrenheitTemperature;
  unit.innerHTML = "ºF";

  for(let i = 1; i < 6; i++) {
    let currentForecast = `forecast${i}`;
    document.querySelector(`#${currentForecast} .max-temp`).innerHTML = Math.round(response.data.list[i].main.temp_max);
    document.querySelector(`#${currentForecast} .min-temp`).innerHTML = Math.round(response.data.list[i-3].main.temp_max);
  }

  
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
}

function convertToCelsius(event) {
  event.preventDefault();
  temperature.innerHTML = Math.round(celsiusTemperature);
  unit.innerHTML = "ºC";
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

/////////////
// JS flow //
/////////////

updateCity("Wellington");

/* Search Input */
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchInput);

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", searchInput);

/* Convert Temperature Units */
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);


/* Current Location Button */ /*
let currentLocation = document.querySelector("#my-location");
currentLocation.addEventListener("click", getCurrentTemperature);

*/