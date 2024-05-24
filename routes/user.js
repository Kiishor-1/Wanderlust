const express = require('express');
const Router = express.Router();
const User = require('../Models/User');
const wrapAsync = require('../Utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl , isLoggedIn, canCheckout} = require('../middleware');
const userController = require('../controllers/users');

Router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signUp));


Router.route("/login")
    .get(userController.renderLogInForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        userController.login);


Router.get("/logout", userController.logout);

Router.get('/dashboard', isLoggedIn, wrapAsync(userController.dashboard));
Router.get('/checkout', isLoggedIn,canCheckout, wrapAsync(userController.checkout));

module.exports = Router;