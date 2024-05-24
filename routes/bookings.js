const User = require('../Models/User');
const Booking = require('../Models/Booking');
const {isLoggedIn} = require('../middleware');
const express = require('express');
const Router = express.Router();
const BookingController = require('../controllers/bookings');
const wrapAsync = require('../Utils/wrapAsync');


Router.route("/:id/book")
    .post(isLoggedIn,wrapAsync(BookingController.initBooking))
    .delete(isLoggedIn, wrapAsync(BookingController.deleteBooking));

module.exports = Router;