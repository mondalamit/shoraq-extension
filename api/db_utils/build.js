// build.js
// builds our RethinkDB database, tables, and documents.
// dependencies: products.json
// NOTE: Make sure RethinkDB is running before using this script...

var r = require('rethinkdb');
var fs = require('fs');

// Connect to RethinkDB
r.connect({host: 'localhost', port: 28015}, function(err, conn) {
  if (err) throw err;
  var connection = conn;
  // Create the db that we use.
  r.dbCreate('shoraq_products').run(connection, function(err, result) {
    if (err) throw err;
    console.log('Build DB:', result);
    // Create the table to store our products.
    r.db('shoraq_products').tableCreate('products').run(connection, function(err, result) {
      if (err) throw err;
      console.log('Build Table:', result);
      // Pull our products from products.json, and insert them our table.
      fs.readFile('products.json', 'utf8', function(err, result) {
        if (err) throw err;
        var products = JSON.parse(result);
        r.db('shoraq_products').table('products').insert(products).run(connection, function(err, result) {
          if (err) throw err;
          console.log('Build Documents:', result);
          r.db('shoraq_products').table('products').indexCreate('videoID').run(connection, function(err) {
            if (err) throw err;
            console.log('Creating index...');
            r.db('shoraq_products').table('products').indexWait('videoID').run(connection, function(err) {
              if (err) throw err;
              console.log('Index created on videoID.');
              connection.close(function(err) {
                if (err) throw err;
              });
            });
          })
        });
      });
    });
  });
});