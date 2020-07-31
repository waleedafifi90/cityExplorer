'user-strict';

const server = require('express');
let cors = require('cors');
require('dotenv').config();

const app = server();
app.use(cors());

// Creating new const for PORT and set the value from .env file if not found set it to 3000
const PORT = process.env.PORT || 3000;

// isten to port from const PORT
app.listen(PORT, () => {
  console.log('I am listening to port: ', PORT);
});

// localhost:3000/location
// Getting data from location.json formated as
// {
//     "search_query": "seattle",
//     "formatted_query": "Seattle, WA, USA",
//     "latitude": "47.606210",
//     "longitude": "-122.332071"
// }
app.get('/location', (req, res) => {
  let city = req.query.city;
  let status = 200;
  let data = require('./data/location.json');
  let getLocation = new Location(city, data[0]);
  res.status(status).send(getLocation);
});

// localhost:3010/weather
// Getting data from weather.json formated as 
// {
//     "forecast": "Partly cloudy until afternoon.",
//     "time": "Mon Jan 01 2001"
// }
app.get('/weather', (req, res) => {
  let city = req.query.city;
  let status = 200;
  let weatherData = require('./data/weather.json');
  Weather.weathers= [];
  weatherData.data.forEach((e) => {
    new Weather(city, e);
  });
  res.status(status).send(Weather.all);
});


// Location Constructor
function Location(city, data) {
  this.search_query = city;
  this.formatted_query = data.display_name;
  this.latitude = data.lat;
  this.longitude = data.lon;
  this.countryCode = data.country_code;
}

// Weather Constructor
function Weather(city, data){
  this.forecast = data.weather.description;
  this.time = new Date(data.valid_date).toString().slice(0, 15);
  Weather.all.push(this);
}
Weather.all=[];
