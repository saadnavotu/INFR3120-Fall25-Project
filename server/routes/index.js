var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Login', displayName: "" });
});

router.get('/register', (req, res) => {
    res.render('auth/register', { title: 'Register', displayName: "" });
});


router.get('/logout', (req, res) => {
    res.redirect('/');
});

module.exports = router;
