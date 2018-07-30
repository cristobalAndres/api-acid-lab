var express = require('express');
var app = express();
const redis = require('redis');

const redisClient = redis.createClient('redis://h:p910adb5a9a02a7bb608752d50cb8d0d6d17ee6a289495ac9155430275a39ca99@ec2-34-231-81-175.compute-1.amazonaws.com:9389');

redisClient.on('error', (err) => {
  console.log('ERROR REDIS', err);
});


app.get('/', function (req, res) {
  redisClient.keys('key_test', (err, data) => {
    if (err) {
      console.log('ERROR', err)
    }
    console.log('DATAa', data);
  })
  res.json('hola mundo');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});