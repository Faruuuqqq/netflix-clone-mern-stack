const router = require('express').Router();
const user = require('./models/user-model.js');
const CryptoJS = require('crypto-js');
// const verify = require('./verifyToken');

// update user by id

router.put('/:id', async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }

    try {
      const updateUser = await user.findByIdandUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateUser);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
      res.status(403).json('You are not authorized to update this user, only your account!');
  }
});

// delete user by id
router.delete('/:id', async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
      try {
        await user.findByIdAndDelete(req.params.id);
        res.status(200).json('User deleted successfully');
      } catch (err) {
        res.status(500).json(err);
      } 
  } else {
        res.status(403).json('You only can delete your account');
  }
});

// get user by id
router.get('/find/:id', async (req, res) =>{
  try {
    const user = await user.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (err) {
      res.status(500).json(err);
  }
});

// get all users
router.get('/', async (req, res) => {
  try {
    const query = req.query.new;
    if (req.user.isAdmin) {
      try {
        const users = query 
          ? await user.find().sort({ _id: -1 }).limit(5)
          : await user.find();
        res.status(200).json(users);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json('You are not allowed to see all users');
    }
  }
});


// get user stats
router.get('/stats', async (req, res) => {
  const today = new Date();
	const lastYear = today.setFullYear(today.setFullYear() - 1);

	const monthsArray = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

  try {
    const data = await user.aggregate([
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1},
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;