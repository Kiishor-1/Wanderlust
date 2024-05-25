const express = require('express');
const Router = express.Router();
const {isLoggedIn} = require('../middleware');
const paymentControllers = require('../controllers/payments');
const wrapAsync = require('../Utils/wrapAsync');

const mid = (req,res, next)=>{
    console.log(req.body);
    next();
}

Router.post("/create-order",mid,isLoggedIn,wrapAsync(paymentControllers.createOrder))
    
Router.post("/verify-payment",isLoggedIn, wrapAsync(paymentControllers.verifyPayment));

module.exports = Router;