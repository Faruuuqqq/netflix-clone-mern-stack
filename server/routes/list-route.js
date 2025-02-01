const router = require('express').Router();
const list = require('../models/list-model.js');
// const verify = require('../verifyToken');

// create list
router.post('/', async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new list(req.body);
    try {
      const savedList = await newList.save();
      res.status(201).json(savedList);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('You are not allowed');
  }
});

// delete list
router.delete('/:id', async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await list.findByIdAndDelete(req.params.id);
      res.status(201).json('The list has been delete');
    } catch (err) {
      res.status(500).json(err);
    } 
  } else {
    res.status(403).json('You are not allowed')
  }
});

// get
router.get('/', async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let listArray = [];

  try {
    if (typeQuery) {
      listArray = await list.aggregate([
        { $match: { type: typeQuery } },  // Filter berdasarkan typeQuery
        { $sample: { size: 10 } },       // Ambil 10 data secara acak
      ]);

      if (genreQuery) {
        listArray = await list.aggregate([
          { $match: { type: typeQuery, genre: genreQuery } }, // Tambah filter genre jika ada
          { $sample: { size: 10 } },
        ]);
      }
    } else {
      listArray = await list.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(listArray);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;