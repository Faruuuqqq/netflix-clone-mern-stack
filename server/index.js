const mongoose = require('mongoose');
const express = require('express');
const app = express();
// const dotenv = require('dotenv');
// dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('DB Connection Succesful'))
  .catch((err) => {
    console.error(err);
  });

app.use(express.json());
app.listen(8000, () => {
  console.log('BackEnd server is running!');
})