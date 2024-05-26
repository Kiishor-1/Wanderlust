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
const Listing = require('./Models/listing.js')
const puppeteer = require('puppeteer');
const Booking = require('./Models/Booking.js')

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

Booking.collection.createIndex({ "paidAt": 1 }, { expireAfterSeconds: 3 * 24 * 60 * 60 });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
    // res.locals.currUser = req.user;
    next();
});

app.use(async (req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            res.locals.currUser = await User.findById(req.user._id).populate('bookings').exec();
        } catch (err) {
            console.error("Error populating bookings:", err);
            res.locals.currUser = req.user;
        }
    } else {
        res.locals.currUser = null;
    }
    next();
});

const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/reviews.js');
const userRouter = require('./routes/user.js');
const bookListings = require('./routes/bookings.js')
const paymentRoutes = require('./routes/payment.js')
app.get("/", (req, res)=>{
    res.redirect("/listings");
})

// app.get('/download-receipt/:id', async (req, res) => {
//     const {id} = req.params;
//     let listing = await Listing.findById(id);
//     const booking = {
//         id: listing._id,
//         guestName: 'John Doe',
//         hotelName: listing.title,
//         checkInDate: '2023-05-01',
//         checkOutDate: '2023-05-07',
//         amount: listing.price
//     };

//     const html = await ejs.renderFile(path.join(__dirname, 'views', 'listings/receipt.ejs'), { booking });

//     try {
//         const browser = await puppeteer.launch({
//             headless: true,  // Set to false for debugging
//             timeout: 60000,   // Increase timeout
//             executablePath: 'C:/Users/nisha/.cache/puppeteer/chrome/win64-125.0.6422.60/chrome-win64/chrome.exe',  // Set the path to Chromium
//             args: ['--no-sandbox', '--disable-setuid-sandbox']  // Additional arguments
//         });

//         const page = await browser.newPage();
//         await page.setContent(html, { waitUntil: 'networkidle0' });

//         const pdfBuffer = await page.pdf({ format: 'A4' });
//         await browser.close();

//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', 'attachment; filename=receipt.pdf');
//         res.send(pdfBuffer);
//     } catch (error) {
//         console.error('Error generating PDF:', error);
//         res.status(500).send('Error generating PDF');
//     }
// });

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/listings",bookListings);
app.use("/", userRouter);
app.use("/payment",paymentRoutes);

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
