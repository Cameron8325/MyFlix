/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define movie schema
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  Starring: [String],
  ImageUrl: String,
  Featured: Boolean,
  Rating: String,
  ReleaseYear: Number,
  TotalTime: String
});

// Define user schema
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

// Hash password before saving
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Validate password
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

// Create models
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

// Export models
module.exports.Movie = Movie;
module.exports.User = User;
