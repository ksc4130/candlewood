const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  url: `mongodb://192.168.1.11/${isDev ? 'cwdev' : 'cwprod'}`
}
