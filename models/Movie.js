const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  type: { type: String, required: true, enum: ['movie', 'series'], default: 'movie' },
  rating: { type: Number, required: true, default: 0 },
  poster: { type: String, required: true },
  description: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  seasons: { type: Number, default: 1 },
  trailerUrl: { type: String, required: true },
  reviewsCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Movie', contentSchema);