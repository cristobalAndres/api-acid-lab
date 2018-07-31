const redis = require('redis');
const axios = require('axios');

const redisClient = redis.createClient('redis://h:p910adb5a9a02a7bb608752d50cb8d0d6d17ee6a289495ac9155430275a39ca99@ec2-34-231-81-175.compute-1.amazonaws.com:9389');

redisClient.on('error', (err) => {
  console.log('ERROR REDIS', err);
});

exports.cities = () =>
new Promise((resolve, reject) => {
   redisClient.get('cities', (err, data) => {
    if (err) {
      console.log('ERROR', err)
      reject(err);
    }
    resolve(data);
  })
});

exports.getData = (latitude, longitude) =>
new Promise((resolve, reject) => {
  axios.get(`https://api.darksky.net/forecast/94031bbeb22906e5bf74b5a1e141679c/${latitude},${longitude}?units=si&lang=es`)
  .then((data) => {
    if (Math.random(0, 1) < 0.1) {
      redisClient.hset(["api.errors", Date.now(), 'Error 10%'], (err, data) => {
        if (err) {
          console.log('ERROR REDIS 10%', err)
          reject(err);
        }
      });
      throw new Error('How unfortunate! The API Request Failed')
    }
    resolve(data.data);
  })
  .catch((err) => {
    console.log(err);
    reject(err);
  });
});