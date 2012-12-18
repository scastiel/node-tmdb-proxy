
var TMDbProxyServer = function(db_filename, port, cache_duration) {
	this.db_filename = db_filename || 'db/tmdb-cache.db'
	this.port = port || 6789;
	this.duration = cache_duration || '+1 day';
}

TMDbProxyServer.prototype.start = function() {
	var express = require('express');
	var request = require('request');
	var sqlite3 = require('sqlite3').verbose();

	var app = new express();
	var db = new sqlite3.Database(this.db_filename);

	var baseurl = 'http://api.themoviedb.org/3';

	app.use(function(req, res) {

		var url = req.url;
		console.log('Processing URL:', url);

		db.get(
			'select result, expires from cache where request = $request',
			{
				$request: url
			}, function(err, row) {
				if (err)
				{
					console.log('Error on select:', err);
					res.send({ error: true });
				}
				
				var fetch_from_tmdb = true;
				var now = Date.now();
				
				if (row)
				{
					console.log('Row in cache.');
					var ts_expires = new Date(row.expires).getTime();
					if (now < ts_expires)
					{
						console.log('Ok, row expires in ' + (ts_expires - now)/1000 + ' seconds.' );
						res.send(row.result);
						fetch_from_tmdb = false;
					}
					else
					{
						console.log('Row expired ' + (now - ts_expires)/1000 + ' seconds ago, let\'s fetch it again...');
						db.run('delete from cache where request = $request', { $request: url });
					}
				}
				
				if (fetch_from_tmdb)
				{
					request(
						{
							uri: encodeURI(baseurl + url),
							headers: {"Accept": 'application/json'}
						},
						function(err2, res2, body) {
							db.run(
								'insert into cache (request, result, expires) values ($request, $result, datetime(current_timestamp, \'localtime\', \'+1 minute\'))',
								{
									$request: url,
									$result: body,
								},
								function(err) {
									if (err) {
										console.log('Error on insert:', err);
										res.send({ error: true });
									}
									console.log('Fetched from TMDb : Ok');
									res.send(body);
								}
							);
						}
					);
				}

			}
		);
	});

	app.listen(this.port);
	console.log('Listening on port ' + this.port);
}

module.exports.TMDbProxyServer = TMDbProxyServer;