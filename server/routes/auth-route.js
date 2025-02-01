const router = require('express').Router();
const user = require('../models/user-model.js');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

// register 
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new user({
    username: username,
    email: email,
    password: CryptoJS.AES.encrypt(
      password,
      process.env.SECRET_KEY
    ).toString(),
  });

  try {
    const User = await newUser.save();
    res.json(user);
  } catch (err) {
      res.status(500).json(err);
  }
});

// login
router.post('/login', async (req, res) => {
  const { email } = req.body;
  try {
    const User = await user.findOne({ email: email });
    !user && res.status(401).json('Wrong password or username');

    const bytes = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    );
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password && 
      res.status(401).json('Wrong password or username!');

    const accessToken = jwt.sign(
      {
        id: user_id,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET_KEY,
      { expiresIn: '999999d'}
    );
  
    const { password, ...info } = user._doc;
    res.status(200).json({ ...info, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;