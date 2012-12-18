node-tmdb-proxy
===============

The aim of *node_tmdb_proxy* is to create a proxy server for accessing the [API](http://docs.themoviedb.apiary.io/) provided by [TheMovieDB.org](http://www.themoviedb.org/). The server uses a cache system which improves requests execution.

Install
-------

First, install *Node.JS*, its package manager *NPM*, and the database system *SQLite3*:

```
sudo apt-get install nodejs npm sqlite3
```

Then, once you *cd* into the *node_tmdb_proxy* directory, install necessary Node.JS modules:

```
npm install
```

One last thing, create the initial cache SQLite DB:

```
cp db/tmdb-cache.db.empty db/tmdb-cache.db
```

Start the server
----------------

Simply run this command:

```
bin/tmdb-proxy start
```

The server runs in background mode. To stop/restart it, use ```bin/tmdb-proxy stop/restart```.

The logs are in the _log_ directory.

Use your proxy
--------------

You can use your proxy exactly the same way you would use the TMDb API server. Just change
the hostname and the port.

For example, instead of using:

```http://api.themoviedb.org/3/movie/628?api_key={YOUR_API_KEY}```

Use:

```http://localhost:6789/movie/628?api_key={YOUR_API_KEY}```

The result should (and must) be exactly the same.

Note that the default port is 6789. 

TODO list
---------

* Modify parameters using a conf file or command line arguments
