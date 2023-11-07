const express = require('express');
const Router = express.Router();
const User = require('../Models/User');
const wrapAsync = require('../Utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controllers/users');

Router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signUp));


Router.route("/login")
    .get(userController.renderLogInForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        userController.login);


Router.get("/logout", userController.logout);

module.exports = Router;