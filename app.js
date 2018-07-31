const express = require('express');
const app = express();
require('dotenv').config();

const mixins = require('./mixins/mixins');

const port = process.env.PORT || 8000;

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/', function (req, res) {
  let citiesData = [];
  // Obtención de la información delas ciudades guardadas
  mixins.cities()
  .then((data) => {
    citiesData = JSON.parse(data);
    // Recorrido de las ciudades y consultar al servicio sobre temperatura y hora de la ciudad solicitada
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
  console.log('Servidor levantado :) !');
});