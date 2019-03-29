const mongoose = require('mongoose');

const isProd = process.env.NODE_ENV === 'production';

const config = {
  url: `mongodb://${process.env.DATABASE_HOST}/${isProd ? 'cwprod' : 'cwdev'}`
};

config.connect = () => {
  return mongoose.connect(config.url);
};

module.exports = config;
