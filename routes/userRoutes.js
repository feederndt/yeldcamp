const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const userControl = require('../controllers/controlUser');

router.get('/register', userControl.formRegis);

router.post('/register', catchAsync(userControl.postRegis));

router.get('/login', userControl.loginForm);

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
    keepSessionInfo: true
    }), userControl.loginPost);

router.get('/logout', userControl.logOut);

module.exports = router;