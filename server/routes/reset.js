const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { User } = require('../model/user'); 


// Simply renders the form where a user enters their email.
// No logic here aside from passing displayName for nav/header.
router.get('/forgot', (req, res) => {
  res.render('auth/forgot', { message: null, displayName: req.user ? req.user.displayName : null });
});



// The link contains a token in the URL. We don't validate it yet;
// we only send it to the view so the form knows which token to submit.
router.get('/reset/:token', (req, res) => {
  const { token } = req.params;
  res.render('auth/reset', { token, message: null, displayName: req.user ? req.user.displayName : null });
});


// Steps: users first enter email, if it exits in data base we geenrate reset token
// then Save hashed token + expiration on user document
// afte it Print reset link to console (dev mode)
// lastlty it geenratte a  success message 
router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    let message = 'Link sent to console.';
    if (user) {
      const rawToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });

       // Send (or in dev: print) the reset link
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset/${rawToken}`;
      console.log('PASSWORD RESET LINK (dev):', resetUrl);
    }
    res.render('auth/forgot', { message, displayName: req.user ? req.user.displayName : null });
  } catch (err) {
    console.error(err);
    res.render('auth/forgot', { message: 'Server error', displayName: req.user ? req.user.displayName : null });
  }
});


// Hash the token from the URL so it matches DB
// Find user with matching token + non-expired token
// If valid, set new password using passport-local-mongoose 
// Clear reset token fields
// Save + re-render success message
router.post('/reset/:token', async (req, res) => {
  try {
    const { password } = req.body;

   // Convert the raw token back to the hashed form stored in DB

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
