const { response } = require('express');
const Listing = require('../Models/listing');
const mbxGeoconding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoconding({ accessToken: mapToken });
const Booking = require('../Models/Booking')

// module.exports.index = async (req, res) => {

//     let allListings = await Listing.find();

//     const { search , category, minPrice, maxPrice} = req.query;
//     console.log(req.query)

//     // Split the search query by spaces
//     let result;
//     if (search) {
//         const searchTerms = search.split(' ');

//         // Build a query object to find documents that match any of the search terms
//         const regexTerms = searchTerms.map(term => new RegExp(term, 'i'));
//         const query = {
//             $or: [
//                 { country: { $in: regexTerms } },
//                 { location: { $in: regexTerms } },
//             ],
//         };
//         // Use the query to find matching documents in the 'listings' collection
//         result = await Listing.find(query);
//         console.log(result)
//     }
//     if(category){
//         result = category ? allListings.filter((listing) => listing.category === category) : allListings;
//     }

//     if (minPrice || maxPrice) {
//         const min = minPrice ? parseInt(minPrice) : Number.MIN_SAFE_INTEGER;
//         const max = maxPrice ? parseInt(maxPrice) : Number.MAX_SAFE_INTEGER;

//         result = result.filter(listing => listing.price >= min && listing.price <= max);
//     }

//     // const { country } = req.query;

//     // // Filter listings based on the country
//     // const cityListings = country
//     //     ? allListings.filter(listing => listing.country.toLowerCase() === country.toLowerCase())
//     //     : allListings;

//     res.render('listings/index.ejs', { allListings: result ? result : allListings, search });
// }

module.exports.index = async (req, res) => {
    let allListings = await Listing.find();

    const { search, minPrice, maxPrice, category } = req.query;

    let result = allListings;

    // If search parameter is provided, filter by country or location
    if (search) {
        const searchTerms = search.split(' ');
        const regexTerms = searchTerms.map(term => new RegExp(term, 'i'));
        const searchQuery = {
            $or: [
                { country: { $in: regexTerms } },
                { location: { $in: regexTerms } },
            ],
        };

        result = await Listing.find(searchQuery);
    }

    // If category parameter is provided, filter by category
    if (category && category.length > 0) {
        result = result.filter(listing => category.includes(listing.category));
    }

    // If minPrice or maxPrice parameters are provided, filter by price range
    if (minPrice || maxPrice) {
        const min = minPrice ? parseInt(minPrice) : Number.MIN_SAFE_INTEGER;
        const max = maxPrice ? parseInt(maxPrice) : Number.MAX_SAFE_INTEGER;

        result = result.filter(listing => listing.price >= min && listing.price <= max);
    }

    res.render('listings/index.ejs', { allListings: result, search });
}



module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner")

    if (!listing) {
        req.flash("error", "Listing you are requesting for is not available");
        return res.redirect("/listings");
    }

    let isBooked = false;
    let isPaid = false;
    let isUnbooked = true;

    if (req.user) {
        const userBookings = await Booking.find({ user: req.user._id, listing: req.params.id });
        isBooked = userBookings.length > 0;

        if (isBooked) {
            isPaid = userBookings.some(booking => booking.status === "Paid");
            isUnbooked = !isPaid;
        }
    }

    res.render("listings/show.ejs", { listing, isBooked, isPaid, isUnbooked });
}


module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.priceAfterTax = newListing.price + (newListing.price*18)/100;
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    // console.log(savedListing);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Linsting you requesting for is not available");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    let changedImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, changedImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();
    let price = req.body.listing.price;
    let priceAfterTax = price + (price*18)/100;
    let updatedListing = await Listing.findByIdAndUpdate(id, {
        ...req.body.listing,
        priceAfterTax:priceAfterTax,
        geometry: response.body.features[0].geometry,
    });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    // console.log("Deleted Data : ", deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}