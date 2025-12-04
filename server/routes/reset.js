// server/routes/reset.js
const express = require('express');
// built in model in node.js so we dont have to install it separately
const crypto = require('crypto');
const router = express.Router();
const { User } = require('../model/user'); 


router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Provide email' });

    const user = await User.findOne({ email: email });
    // don't reveal whether user exists
    if (!user) {
      return res.json({ message: 'link sent to email.' });
    }

    // create token and save with expiry
    const rawToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //  for dev
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset/${rawToken}`;
    console.log('PASSWORD RESET LINK (dev):', resetUrl);

    return res.json({ message: 'Link sent to email.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});


router.post('/reset/:token', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Create new password' });

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Token invalid.' });

    // passport -local -mongosse handles the ahsing


    user.setPassword(password, async (err) => {
      if (err) {
        console.error('setPassword error', err);
        return res.status(500).json({ message: 'Error setting password' });
      }

      // clear reset fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();
      return res.json({ message: 'Password reset successful. You can now log in.' });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
