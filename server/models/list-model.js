const mongoose = require('mongoose');

const listSchema = new mongoose.listSchema(
  {
    title: { type: String, required: true },
    type: { type: String },
    genre: { type: String },
    content: { type: String },  
  },
  { timestamps: true }
);

module.exports = mongoose.model('list', listSchema);