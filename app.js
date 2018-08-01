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

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/', (req, res) => {

});

wss.on('connection', (ws) => {
  const id = setInterval(() => {
    mixins.initData().then((data) => {
      ws.send(JSON.stringify(data));
    })
    .catch((error) => {
      console.log('ERROR', error);
    });
  }, 10000);

  ws.on("close", () => {
    console.log("websocket close")
    clearInterval(id)
  })
})

server.listen(port)