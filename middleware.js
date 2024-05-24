const Listing = require('./Models/listing');
const Review = require('./Models/Review');
const { listingSchema ,reviewSchema} = require('./schema.js');
const ExpressError = require('./Utils/ExpressError');

module.exports.isLoggedIn = (req, res, next)=>{
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please Log In first");
        return res.redirect("/login");
    }
    next();  
};

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to make changes");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.isAuthor = async (req, res, next)=>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to make changes");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.listingValidation = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}
module.exports.reviewValidation = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.canCheckout = (req, res, next)=>{
    const user = req.user;
    if(user.bookings.length <= 0){
        req.flash("error","We have a lot more for you");
        return res.redirect('/listings');
    }
    next(); 
}