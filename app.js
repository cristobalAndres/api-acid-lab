const express = require('express');
const app = express();

const mixins = require('./mixins/mixins');

const port = process.env.PORT || 8000;

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.get('/', function (req, res) {
  let citiesData = [];
  mixins.cities()
  .then((data) => {
    citiesData = JSON.parse(data);
    const promises = citiesData.map(city => mixins.getData(city.latitude, city.longitude));
    return Promise.all(promises);
  })
  .then((data) => {
    res.json(data)
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(400);
  })
});

app.listen(port, function () {
  console.log('Example app listening on port 8000!');
});