const express = require('express');
var assert = require('assert');
const app = express();
const http = require("http")
require('dotenv').config();
const port = process.env.PORT || 8000;
const mixins = require('./mixins/mixins');

const server = http.createServer(app)

const WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({server: server})

console.log("http server listening on %d", port);

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/', function (req, res) {
  // let citiesData = [];
  // // Obtención de la información delas ciudades guardadas
  // mixins.cities()
  // .then((data) => {
  //   citiesData = JSON.parse(data);
  //   // Recorrido de las ciudades y consultar al servicio sobre temperatura y hora de la ciudad solicitada
  //   const promises = citiesData.map(city => mixins.getData(city.latitude, city.longitude));
  //   return Promise.all(promises);
  // })
  // .then((data) => {
  //   res.json(data)
  // })
  // .catch((err) => {
  //   console.log(err);
  //   res.sendStatus(400);
  // })
});

wss.on('connection', function (ws) {
  // ws.on('message', function (message) {
  //   console.log('received: %s', message)
  // })

  // setInterval(
  //   () => ws.send(mixins.initData().then((data) => {
  //     return data;
  //   })),
  //   1000
  // )
  const id = setInterval(() => {
    mixins.initData().then((data) => {
      ws.send(JSON.stringify(data));
    })
    .catch((error) => {
      console.log('ERRROR', error);
    });
  }, 10000);

  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
})

server.listen(port)