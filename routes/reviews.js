const express = require('express');
const Router = express.Router({mergeParams:true});
const Review = require("../Models/Review.js");
const Listing = require('../Models/listing.js');
const wrapAsync = require('../Utils/wrapAsync.js');
const ExpressError = require('../Utils/ExpressError.js');
const {reviewValidation, isLoggedIn, isAuthor} = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');


//Review Creating Route
Router.post("/",isLoggedIn, reviewValidation, wrapAsync(reviewController.createReview));


//Review Delete Route
Router.delete("/:reviewId",
    isLoggedIn,
    isAuthor, 
    wrapAsync(reviewController.destroyReview));

module.exports = Router;