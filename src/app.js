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
let defaultCity = null;
let thermicFeeling = null;
let isNavigationOn = false;

let temperatureContainer = document.querySelector("#current-temperature");
let unitContainer = document.querySelector("#unit");
let thermicFeelingContainer = document.querySelector("#thermic-feeling");


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
  let pressure = document.querySelector("#pressure");
  let visibility = document.querySelector("#visibility");
  let sunrise = document.querySelector("#sunrise");
  let sunset = document.querySelector("#sunset");
  let icon = document.querySelector("#today-icon");

  celsiusTemperature = response.data.main.temp;
  defaultCity = `${response.data.name}`;
  thermicFeeling = response.data.main.feels_like;

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  
  unitContainer.innerHTML = "ºC";
  temperatureContainer.innerHTML = Math.round(response.data.main.temp);
  currentCity.innerHTML = `${response.data.name}`;
  currentDate.innerHTML = updateDate(response.data.dt * 1000);
  weatherDetail.innerHTML = `${response.data.weather[0].description}`;
  currentHumidity.innerHTML = `${response.data.main.humidity}%`;
  currentWind.innerHTML = `${Math.round(response.data.wind.speed)} Km/h`;
  thermicFeelingContainer.innerHTML = `${Math.round(response.data.main.feels_like)}`;
  pressure.innerHTML = `${Math.round(response.data.main.pressure)}`;
  visibility.innerHTML = `${Math.round(response.data.visibility / 1000)}`;
  sunrise.innerHTML = getTime(response.data.sys.sunrise * 1000);
  sunset.innerHTML = getTime(response.data.sys.sunset * 1000);
  icon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  icon.setAttribute(
    "alt",
    `${response.data.weather[0].description}`);

  if(isNavigationOn = true) {
    let apiUrlForecast = `${apiForecastEndpoint}q=${defaultCity}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrlForecast).then(updateForecast);
    isNavigationOn = false;
  } else {}
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
 
  isNavigationOn = true;

  let apiUrl = `${apiEndpoint}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(updateTemperature);
}

function getCurrentTemperature() {
  navigator.geolocation.getCurrentPosition(getTemperaturePosition);
}


/* Conversion temperature unit functions */
function convertToFahrenheit(event) {
  event.preventDefault();
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9/5) + 32);
  temperatureContainer.innerHTML = fahrenheitTemperature;
  thermicFeelingContainer.innerHTML = Math.round((thermicFeeling * 9/5) + 32);
  unitContainer.innerHTML = "ºF"; 
  let unit_f = "imperial";
  let apiUrlForecast = `${apiForecastEndpoint}q=${defaultCity}&appid=${apiKey}&units=${unit_f}`;
  axios.get(apiUrlForecast).then(updateForecast);

  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
}

function convertToCelsius(event) {
  event.preventDefault();
  temperatureContainer.innerHTML = Math.round(celsiusTemperature);
  thermicFeelingContainer.innerHTML = Math.round(thermicFeeling);
  unitContainer.innerHTML = "ºC";

  let apiUrlForecast = `${apiForecastEndpoint}q=${defaultCity}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrlForecast).then(updateForecast);

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

/////////////
// JS flow //
/////////////

updateCity("Lisbon");

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

/* Current Location Button */ 
let currentLocation = document.querySelector("#my-location");
currentLocation.addEventListener("click", getCurrentTemperature);

