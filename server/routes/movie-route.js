const router = require('express').Router();
const movie = require('../models/movie-model.js');
// const verify = require('../verifyToken.js');

// get all movie
router.get('/', async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const movies = await movie.find();
      res.status(200).json(movies.reverse());
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
      res.status(403).json('you are not allowed');
  }
})

// create
router.post('/', async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new movie(req.body);

    try {
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch (err) {
        res.status(500).json(err);
    }
  } else {
      res.status(403).json('You are not allowed');
  }
});

// update
router.put('/:id', async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      const updatedMovie = await movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true}
      );
      res.status(200).json(updatedMovie);
    } catch (err){
        res.status(500).json(err);
    }
  }  else {
    res.status(403).json('You are not authorized to update this movie!');
  }
});

// delete
router.delete('/:id', async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await movie.findByIdAndDelete(req.params.id);
      res.status(200).json('Movie deleted successfully');
    } catch (err) {
        res.status(403).json('You are not authorized to delete this movie!');
    }
  }
});

// get movie random
router.get('/random', async (req, res) => {
  const type = req.query.type;
  let movie;
  
  try {
    if (type === 'series') {
      movie = await movie.aggregate([
        { $match: { isSeries: true} },
        { $sample: { size: 1 } },
      ]);
    } else { 
      movie = await movie.aggregate([
        { $match: {isSeries: false} },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (err) {
      res.status(500).json(err);
  }
});

module.exports = router;