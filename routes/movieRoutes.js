const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// GET movies by genre (Sorted by rating descending)
router.get('/', async (req, res) => {
  try {
    const { genre } = req.query;
    let query = {};
    if (genre && genre !== 'All') {
      query.genre = genre;
    }
    // High ratings on top
    const movies = await Movie.find(query).sort({ rating: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single movie details
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;