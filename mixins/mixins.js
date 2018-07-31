const redis = require('redis');
const axios = require('axios');

// Conexión a redis
const redisClient = redis.createClient(process.env.REDIS_CONNECT);

redisClient.on('error', (err) => {
  console.log('ERROR REDIS', err);
});

// Busqueda de información de las ciudades guardadas en redis
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

// Consulta a la API  para obtener la información de la ciudad a partir de la latitud y longitud enviada
exports.getData = (latitude, longitude) =>
new Promise((resolve, reject) => {
  axios.get(`https://api.darksky.net/forecast/${process.env.KEY}/${latitude},${longitude}?units=si&lang=es&exclude=minutely,hourly,daily,alerts,flags`)
  .then((data) => {
    // Posibilidad de error de 10%
    if (Math.random(0, 1) < 0.1) {
      // Almacenamiento en el hash de error en redis
      redisClient.hset(["api.errors", Date.now(), 'Error 10%'], (err, data) => {
        if (err) {
          console.log('ERROR REDIS 10%', err)
          reject(err);
        }
        // Reconexión al servicio de información de la ciudad por si existen fallas
        this.getData(latitude, longitude);
      });
    }
    resolve(data.data);
  })
  .catch((err) => {
    console.log(err);
    reject(err);
  });
});