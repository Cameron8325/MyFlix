const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.static('public'));

app.get('/movies', (req, res) => {
    const top10Movies = [
        {
            title: 'The Shawshank Redemption',
            director: 'Frank Darabont',
            year: 1994,
            rating: 9.3,
        },
        {
            title: 'The Godfather',
            director: 'Francis Ford Coppola',
            year: 1972,
            rating: 9.2,
        },
        {
            title: 'The Dark Knight',
            director: 'Christopher Nolan',
            year: 2008,
            rating: 9.0,
        },
        {
            title: 'Pulp Fiction',
            director: 'Quentin Tarantino',
            year: 1994,
            rating: 8.9,
        },
        {
            title: 'Schindler\'s List',
            director: 'Steven Spielberg',
            year: 1993,
            rating: 8.9,
        },
        {
            title: 'Forrest Gump',
            director: 'Robert Zemeckis',
            year: 1994,
            rating: 8.8,
        },
        {
            title: 'The Matrix',
            director: 'Lana Wachowski, Lilly Wachowski',
            year: 1999,
            rating: 8.7,
        },
        {
            title: 'Inception',
            director: 'Christopher Nolan',
            year: 2010,
            rating: 8.7,
        },
        {
            title: 'Goodfellas',
            director: 'Martin Scorsese',
            year: 1990,
            rating: 8.7,
        },
        {
            title: 'Fight Club',
            director: 'David Fincher',
            year: 1999,
            rating: 8.8,
        }
    ];
    res.json(top10Movies);
});

app.get('/', (req, res) => {
    res.send('Welcome to MyFlix!');
  });