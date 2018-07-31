const express = require('express');
const app = express();

const mixins = require('./mixins/mixins');

const port = process.env.PORT || 8000;

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