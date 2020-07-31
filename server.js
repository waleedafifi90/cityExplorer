'user-strict';

const server = require('express');
let cors = require('cors');
require('dotenv').config();

const app = server();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('I am listening to port: ', PORT);
  });

app.get('/location', (req, res) => {
    let city = req.query.city;
    let status = 200;
    let data = require('./data/location.json');
    let getLocation = new Location(city, data[0]);
    res.status(status).send(getLocation);
});
  
function Location(city, data) {
    this.search_query = city;
    this.formatted_query = data.display_name;
    this.latitude = data.lat;
    this.longitude = data.lon;
    this.countryCode = data.country_code;
}

