const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { User } = require('../model/user'); 

router.get('/forgot', (req, res) => {
  res.render('auth/forgot', { message: null, displayName: req.user ? req.user.displayName : null });
});

router.get('/reset/:token', (req, res) => {
  const { token } = req.params;
  res.render('auth/reset', { token, message: null, displayName: req.user ? req.user.displayName : null });
});

router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    let message = 'Link sent to console.';
    if (user) {
      const rawToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset/${rawToken}`;
      console.log('PASSWORD RESET LINK (dev):', resetUrl);
    }
    res.render('auth/forgot', { message, displayName: req.user ? req.user.displayName : null });
  } catch (err) {
    console.error(err);
    res.render('auth/forgot', { message: 'Server error', displayName: req.user ? req.user.displayName : null });
  }
});

router.post('/reset/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.render('auth/reset', { token: req.params.token, message: 'Token invalid', displayName: req.user ? req.user.displayName : null });
    }

    user.setPassword(password, async (err) => {
      if (err) {
        console.error('setPassword error', err);
        return res.render('auth/reset', { token: req.params.token, message: 'Error setting password', displayName: req.user ? req.user.displayName : null });
      }

      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      res.render('auth/reset', { token: req.params.token, message: 'Password reset successful. You can now log in.', displayName: req.user ? req.user.displayName : null });
    });
  } catch (err) {
    console.error(err);
    res.render('auth/reset', { token: req.params.token, message: 'Server error', displayName: req.user ? req.user.displayName : null });
  }
});

module.exports = router;
