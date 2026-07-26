const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Movie = require('../models/Movie');

// GET reviews for a movie
router.get('/:movieId', async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new review and recalculate movie average rating
router.post('/', async (req, res) => {
  const { movieId, author, rating, comment } = req.body;

  try {
    const newReview = new Review({
      movieId,
      author,
      rating: Number(rating),
      comment
    });
    await newReview.save();

    // Recalculate movie rating
    const allReviews = await Review.find({ movieId });
    const avgRating = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

    await Movie.findByIdAndUpdate(movieId, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewsCount: allReviews.length
    });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;