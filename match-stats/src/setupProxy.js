const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/lol/match/v4/matchlists/by-account/', { 
  	target: 'https://na1.api.riotgames.com' ,
  	changeOrigin: true,
  	secure: false,
  	logLevel: "debug",
  	rejectUnauthorized: false
  }));
};