if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require('./Utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./Models/User.js');

// const dbUrl = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLAS_SERVER_URL;

main().then(res => {
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24* 3600,
});

store.on("error", ()=>{
    console.log("ERROR IN MONGO SESSION STORE", error);
})

const sessionOption = { 
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 3* 24 * 60*60*1000,
        maxAge:3* 24 * 60*60*1000,
        httpOnly: true
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.alertMsg = req.flash("success");
    res.locals.errortMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/reviews.js');
const userRouter = require('./routes/user.js');
app.get("/", (req, res)=>{
    res.redirect("/listings");
})
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { err, req, statusCode });
})

let port = 8080;
app.listen(port, (req, res) => {
    console.log(`Server running on port ${port}`);
})
