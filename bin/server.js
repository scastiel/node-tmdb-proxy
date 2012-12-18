
var TMDbProxyServer = require('..').TMDbProxyServer;
var server = new TMDbProxyServer(__dirname + '/../db/tmdb-cache.db');
server.start();