const mongoose = require('mongoose');

const isProd = process.env.NODE_ENV === 'production';

const config = {
  url: `mongodb://192.168.1.11/${isProd ? 'cwprod' : 'cwdev'}`
};

config.connect = () => {
  return mongoose.connect(config.url);
};

module.exports = config;

