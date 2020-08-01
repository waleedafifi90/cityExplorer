'user-strict';

const server = require('express');
const superagent = require('superagent');
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


app.all('*', (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, HEAD, PUT, PATCH, POST, DELETE'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});



// ********
// .env variables
// ********
let GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
let WEATHER_API_KEY = process.env.WEATHER_API_KEY;
let NUMBER_OF_DAY = process.env.NUMBER_OF_DAY;


// ********
// Routes
// ********
app.get('/location', handelLocation);
app.get('/weather', handelWeather);
app.get('/trails', handelTrails);


// localhost:3000/location
// Getting data from location.json formated as
// {
//     "search_query": "seattle",
//     "formatted_query": "Seattle, WA, USA",
//     "latitude": "47.606210",
//     "longitude": "-122.332071"
// }


// localhost:3010/weather
// Getting data from weather.json formated as
// {
//     "forecast": "Partly cloudy until afternoon.",
//     "time": "Mon Jan 01 2001"
// }
app.get('/weather', (req, res) => {
  let status = 200;
  getWeather(req, res);
  res.status(status).send(Weather.all);
});

// ********
// Error route
// ********
app.all('*', (req, res) => {
  let status = 500;
  res.status(status).send({ responseText: 'Sorry, something went wrong' });
});

// ********
// Functions
// ********

function handelLocation(req, res) {
  let city = req.query.city;
  let reqex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;

  if (!reqex.test(city)) { res.status(422).send({ 'status': 422, msg: 'Please enter a valid city name!'}); }
  if(!city) { res.status(500).send({ 'status': 500, responseText: 'Sorry, something went wrong'}); }

  getLocationData(city).then( returnedData => {
    res.send(returnedData);
  }).catch((err) => {
    console.log(err.message);
  });
}

function getLocationData(city) {
  let url = `https://api.locationiq.com/v1/autocomplete.php?key=${GEOCODE_API_KEY}&q=${city}`;
  let data = superagent.get(url).then((res) => {
    console.log(res.body[0]);
    return new Location(city, res.body[0]);
  });
  return data;

}


function handelWeather(req, res) {
  getWeather(req).then( returnedData => {
    console.log('response: ', returnedData);
    res.send(returnedData);
  }).catch((err) => {
    console.log(err.message);
  });
}

function getWeather(req) {
  let lat = req.query.latitude;
  let lon = req.query.longitude;
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}&days=${NUMBER_OF_DAY}`;
  let data = superagent.get(url).then((res) => {
    console.log(res.body.data);
    return res.body.data.map((e) => {
      return new Weather(e);
    });
  });
  return data;
}

function handelTrails(req, res) {
  let latitude = req.query.latitude;
  let longitude = req.query.longitude;

  getTrails(latitude, longitude).then( returnedData => {
    res.send(returnedData);
  }).catch((err) => {
    console.log(err.message);
  });
}

function getTrails(lat, lon) {
  let HIKING_API_KEY = process.env.HIKING_API_KEY;
  let url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=1000&key=${HIKING_API_KEY}`;

  return superagent.get(url).then( data => {
    console.log(data.body.trails);
    return data.body.trails.map( data => {
      return new Trails(data);
    });
  });
}


// Location Constructor
function Location(city, data) {
  this.search_query = city;
  this.formatted_query = data.display_name;
  this.latitude = data.lat;
  this.longitude = data.lon;
  this.countryCode = data.address.country_code;
}

// Weather Constructor
function Weather(data){
  this.forecast = data.weather.description;
  this.time = new Date(data.valid_date).toString().slice(0, 15);
  Weather.all.push(this);
}
Weather.all=[];

function Trails(data) {
  this.name = data.name;
  this.location = data.location;
  this.length = data.length;
  this.stars = data.stars;
  this.star_votes = data.starVotes;
  this.summary = data.summary;
  this.trail_url = data.url;
  this.conditions = data.conditionStatus;
  this.condition_date = new Date(data.conditionDate).toLocaleDateString();
  this.condition_time = new Date(data.conditionDate).toLocaleTimeString('en-US', { hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'});
  Trails.all.push(this);
}
Trails.all = [];
