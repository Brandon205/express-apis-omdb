require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const axios = require('axios');

// Sets EJS as the view engine
app.set('view engine', 'ejs');
// Specifies the location of the static assets folder
app.use(express.static('static'));
// Sets up body-parser for parsing form data
app.use(express.urlencoded({ extended: false }));
// Enables EJS Layouts middleware
app.use(ejsLayouts);

// Adds some logging to each request
app.use(require('morgan')('dev'));

// Routes
app.get('/', function(req, res) {
  res.render('index.ejs');
});

app.get('/results', function(req, res) {
  axios.get('http://www.omdbapi.com', {
    params: {
      s: req.query.q,
      apikey: process.env.API_KEY
    }
  })
    .then(function(foundMovies) {
      res.render('results.ejs', { movies: foundMovies.data.Search });
    });
});

app.get('/detail', function(req, res) {
  axios.get('http://www.omdbapi.com', {
    params: {
      i: req.query.i,
      apikey: process.env.API_KEY
    }
  })
    .then(function(movie) {
      res.render('detail', { film: movie.data });
    });
});

// The app.listen function returns a server handle
var server = app.listen(process.env.PORT || 3000);

// We can export this server to other servers like this
module.exports = server;
