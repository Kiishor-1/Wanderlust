const express = require('express');
const Router = express.Router();
const Review = require("../Models/Review.js");
const Listing = require('../Models/listing.js');
const wrapAsync = require('../Utils/wrapAsync.js');
const ExpressError = require('../Utils/ExpressError.js');
const { isLoggedIn, isOwner, listingValidation } = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const { storage, cloudinary } = require('../cloudConfig.js'); 
const upload = multer({ storage: storage });

Router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]') ,listingValidation, wrapAsync(listingController.createListing));


//new /create form request
Router.get("/new", isLoggedIn, listingController.renderNewForm);

Router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]') , listingValidation, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));




//edit form route
Router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

module.exports = Router;