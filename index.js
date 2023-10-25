const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://127.0.0.1:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');


const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.static('public'));

// Endpoint to return a list of ALL movies to the user
app.get('/movies', async (req, res) => {
    Movies.find().then(Movies => res.json(Movies));
});


// Endpoint to return data about a single movie by title
app.get('/movies/:title', (req, res) => {
    const movieTitle = req.params.title;
    res.send(`Return data about the movie with title: ${movieTitle}`);
});

// Endpoint to return data about a genre by name
app.get('/genres/:name', (req, res) => {
    const genreName = req.params.name;
    res.send(`Return data about the genre with name: ${genreName}`);
});

// Endpoint to return data about a director by name
app.get('/directors/:name', (req, res) => {
    const directorName = req.params.name;
    res.send(`Return data about the director with name: ${directorName}`);
});

// Endpoint to allow new users to register
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
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
app.put('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    res.send(`Update user info for user with ID: ${userId}`);
});

// Endpoint to allow users to add a movie to their list of favorites
app.post('/users/:userId/favorites', (req, res) => {
    const userId = req.params.userId;
    res.send(`Movie added to favorites for user with ID: ${userId}`);
});

// Endpoint to allow users to remove a movie from their list of favorites
app.delete('/users/:userId/favorites/:movieId', (req, res) => {
    const userId = req.params.userId;
    const movieId = req.params.movieId;
    res.send(`Movie removed from favorites for user with ID: ${userId}, Movie ID: ${movieId}`);
});

// Endpoint to allow existing users to deregister
app.delete('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    res.send(`User with ID ${userId} has been deregistered`);
});

app.get('/', (req, res) => {
    res.send('Welcome to MyFlix!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});