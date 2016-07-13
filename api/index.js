var compression = require('compression');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var r = require('rethinkdb');
var cors = require('cors');
var helmet = require('helmet');
var app = express();

app.use(compression()); // gzip compression
app.use(morgan('dev')); // http request logging
app.use(bodyParser.json()); // enable json body parsing
app.use(cors()); // enable requests from other domains (CORS)
app.use(helmet()); // secure our API with helmet

// Connect to RethinkDB
var connection = null;
r.connect({host: 'localhost', port: 28015}, function(err, conn) {
  if (err) throw err;
  connection = conn;
});

// POST : {videoID : 'ID'}
// Return: [Product]
app.post('/api/products', function(req, res) {
	// grab videoID from request body.
	var videoID = req.body.videoID;

  if (videoID !== null) {
    r.db('shoraq_products').table('products').getAll(videoID, {index: 'videoID'})
    .run(connection, function(err, cursor) {
      if (err) throw err;
      cursor.toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
      });
    });
  }
});

app.use(function (error, request, response, next) {
  response.status(error.status || 500);
  response.json({ error: error.message });
});

var server = app.listen(3000);

console.log('App is running on http://' + server.address().address + ':' + server.address().port);
