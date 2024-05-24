const User = require('../Models/User');
const Booking = require('../Models/Booking')

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req, res, next) => {
    try {
        let { email, username, password } = req.body;
        let newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome To WanderLust");
            res.redirect("/listings");
        });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogInForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login =  async (req, res)=>{
    req.flash("success", "Welcome back to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logOut(err => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged Out");
        res.redirect("/listings");
    });
}

module.exports.dashboard = async(req, res)=>{
    try {
        const userId = req.user._id;
        const bookings = await Booking.find({ user: userId }).populate('listing').exec();
        console.log(bookings);
        res.render('users/dashboard', { bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.redirect('/listings');
    }
}

module.exports.checkout = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
        path: "bookings",
        populate: {
            path: "listing",
        }
    });
    const bookings = user.bookings;
    let price = 0;
    bookings.forEach(element => {
        price += element.listing.price;
    });
    console.log(price)
    res.render('users/checkout', { price });
}