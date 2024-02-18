const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const express = require('express');
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
let allowedOrigins = ['https://camflixcf-73cf2f8e0ca3.herokuapp.com', 'https://cameron8325.github.io', 'http://localhost:1234', 'http://localhost:4200', 'https://main--myflix-mcs.netlify.app','https://myflix-mcs.netlify.app'];


const { check, validationResult } = require('express-validator');

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = "The CORS policy for this application doesn't allow access from origin " + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport.js');

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.static('public'));

// Endpoint to return a list of ALL movies to the user
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Endpoint to return current user information
app.get('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOne({ Username: req.params.username })
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found.');
      }
      res.json(user);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Endpoint to return favorite movies for a user
app.get('/users/:username/favorite-movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOne({ Username: req.params.username })
    .populate('FavoriteMovies')
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found.');
      }
      res.json(user.FavoriteMovies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Endpoint to return data about a single movie by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      if (!movie) {
        return res.status(404).send('No movies found for the specified title.');
      }
      res.json(movie);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Endpoint to return data about a genre by name
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find({ 'Genre.Name': req.params.name })
    .then((movies) => {
      if (movies.length === 0) {
        return res.status(404).send('No movies found for the specified genre.');
      }
      res.json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Endpoint to return data about a director by name
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ 'Director.Name': req.params.name })
    .then((movie) => {
      if (!movie) {
        return res.status(404).send('No movies found for the specified title.');
      }
      res.json(movie);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Endpoint to allow new users to register
app.post('/register',
[
  check('Username', 'Username is required')
    .not().isEmpty()
    .isAlphanumeric().withMessage('Username should only contain letters and numbers')
    .isLength({ min: 3, max: 20 }).withMessage('Username should be between 3 and 20 characters'),
  check('Password', 'Password is required')
    .not().isEmpty()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  check('Email', 'Email is required')
    .not().isEmpty()
    .isEmail().withMessage('Invalid email address'),
  check('Birthday', 'Birthday is required')
    .not().isEmpty()
], async (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });  
}

  let hashedPassword = Users.hashPassword(req.body.Password)
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Endpoint to allow users to update their user info
app.put('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.Username !== req.params.username) {
    return res.status(400).send('Permission denied');
  }

  const updateData = {
    Username: req.body.Username,
    Email: req.body.Email,
    Birthday: req.body.Birthday,
  };

  // Check if the password is provided and hash it
  if (req.body.Password) {
    try {
      const hashedPassword = await Users.hashPassword(req.body.Password);
      updateData.Password = hashedPassword;
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error hashing password');
    }
  }

  await Users.findOneAndUpdate({ Username: req.params.username }, { $set: updateData }, { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Endpoint to allow users to add a movie to their list of favorites
app.post('/users/:username/movies/:movieid', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.username }, {
    $push: { FavoriteMovies: req.params.movieid }
  },
    { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Endpoint to allow users to remove a movie from their list of favorites
app.delete('/users/:username/movies/:movieid', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.username }, {
    $pull: { FavoriteMovies: req.params.movieid }
  },
    { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Endpoint to allow existing users to deregister
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found.');
      } else {
        res.status(200).send(req.params.username + ' deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/', (req, res) => {
  res.send('Welcome to MyFlix!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});