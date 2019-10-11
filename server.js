require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const axios = require('axios');
const db = require('./models');

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
      console.log(movie.data);
      res.render('detail', { movie: movie.data });
    });
});


app.post('/faves', function(req, res) {
  // res.send(req.body);
  console.log(req.body)
  db.fave.findOrCreate({
    where: {
      imdbid: req.body.imdbid
    },
    defaults: {
      title: req.body.Title
    }
  })
    .then(function([fave, created]) {
      // console.log(`${fave.title} is ${created ? 'now in my faves' : 'already in my faves'}`);
      res.redirect('/faves');
    });
});

app.get('/faves', function(req, res) {
  // res.send('My Faves');
  db.fave.findAll()
    .then(function(foundFaves) {
      res.render('faves.ejs', { fave: foundFaves });
    });
});

// The app.listen function returns a server handle
var server = app.listen(process.env.PORT || 3000);

// We can export this server to other servers like this
module.exports = server;
