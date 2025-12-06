var express = require('express');
var router = express.Router();
const upload = require('../config/multer');
let userModel = require('../model/user');
let User = userModel.User;
const fs = require('fs');
const path = require('path');

router.post('/delete-pfp', async (req, res) => {
  try {
    const user = req.user;

    if (user.profileImage && user.profileImage !== 'default.png') {
      const filePath = path.join(__dirname, '../../public/uploads', user.profileImage);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      user.profileImage = null;
      await user.save();
    }

    res.redirect('/users/profile');
  } catch (err) {
    console.error(err);
    res.redirect('/users/profile');
  }
});

// profile page
router.get('/profile', (req, res, next) => {
  if(!req.user) {
    return res.redirect('/login');
  }
  res.render('auth/profile', {
    user: req.user,
    displayName: req.user.displayName,
    profileImage: req.user.profileImage
  });
});

// image upload handling
router.post('/upload', upload.single('profileImage'), async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    user.profileImage = req.file.filename;
    await user.save();
    res.redirect('/users/profile');
  } catch (error) {
    console.error(err);
    res.send("Upload failed");
  }
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;
