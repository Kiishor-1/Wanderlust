const Booking = require('../Models/Booking');
const User = require('../Models/User');
const Listing = require('../Models/listing');

module.exports.initBooking = async (req, res) => {
    // console.log(req.params.id)
    try {
        const listingId = req.params.id;
        const userId = req.user._id;

        // Check if the user has already booked this listing
        const existingBooking = await Booking.findOne({ user: userId, listing: listingId });
        if (existingBooking) {
            return res.redirect(`/listings/${listingId}`);
        }

        // Create a new booking
        const booking = new Booking({ user: userId, listing: listingId, status: "Booked" });
        await booking.save();

        // Add booking ID to user's bookings
        const user = await User.findById(userId);
        if (!user.bookings.includes(booking._id)) {
            user.bookings.push(booking._id);
            await user.save();
        }

        res.redirect(`/listings/${listingId}`);
    } catch (error) {
        console.error("Error booking listing:", error);
        res.redirect(`/listings/${req.params.id}`);
    }
}



function calculateTotalRent(checkIn, checkOut, price, priceAfterTax, guests) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Ensure dates are valid
    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
        console.error("Invalid check-in or check-out date.");
        return 0;
    }

    let sum = 0;
    if (guests.adults <= 2) {
        sum += priceAfterTax;
    } else {
        let extras = guests.adults - 2;
        sum += extras * (price / 2) + priceAfterTax;
    }
    if (guests.children > 2) {
        let extras = guests.children - 2;
        sum += extras * (price / 4);
    }
    if (guests.infants > 2) {
        let extras = guests.infants - 2;
        sum += extras * (price / 4);
    }
    const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

    // Ensure nights are valid
    if (isNaN(nights) || nights < 0) {
        console.error("Invalid number of nights.");
        return 0;
    }

    return sum * (nights + 1);
}

module.exports.initBooking2 = async (req, res) => {
    const listingId = req.params.id;
    const userId = req.user._id;

    const { checkIn, checkOut, adults, children, infants } = req.body;

    try {
        const existingBooking = await Booking.findOne({ user: userId, listing: listingId });
        if (existingBooking) {
            return res.redirect(`/listings/${listingId}`);
        }
        const currListing = await Listing.findById(listingId);
        let listingPrice = currListing.price;
        let listingPriceAfterTax = currListing.priceAfterTax;
        const totalRent = calculateTotalRent(checkIn, checkOut, listingPrice, listingPriceAfterTax, { adults, children, infants });

        if (isNaN(totalRent)) {
            console.error("Total rent calculation resulted in NaN.");
            return res.status(400).send("Error calculating total rent");
        }

        const newBooking = new Booking({
            user: req.user._id,
            listing: listingId,
            status: "Booked",
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            guests: { adults, children, infants },
            totalRent
        });

        const newB = await newBooking.save();
        console.log(newB);
        const user = await User.findById(userId);
        if (!user.bookings.includes(newBooking._id)) {
            user.bookings.push(newBooking._id);
            await user.save();
        }

        res.redirect(`/listings/${listingId}`);
    } catch (err) {
        console.error("Error booking listing:", err);
        res.redirect(`/listings/${req.params.id}`);
    }
}


module.exports.deleteBooking = async (req, res) => {
    try {
        const listingId = req.params.id;
        const userId = req.user._id;

        // Find the booking to remove
        const booking = await Booking.findOne({ user: userId, listing: listingId });
        if (!booking) {
            req.flash("error", "You have not reserved this listing");
            return res.redirect(`/listings/${listingId}`);
        }

        // Remove booking ID from user's bookings
        await User.findByIdAndUpdate(userId, { $pull: { bookings: booking._id } });

        // Delete the booking
        await Booking.findByIdAndDelete(booking._id);

        res.redirect(`/listings/${listingId}`);
    } catch (error) {
        console.error("Error unbooking listing:", error);
        res.redirect(`/listings/${req.params.id}`);
    }
}

