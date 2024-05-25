const Booking = require('../Models/Booking');
const User = require('../Models/User');

module.exports.initBooking = async (req,res)=>{
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
        const booking = new Booking({ user: userId, listing: listingId,status:"Booked" });
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

module.exports.deleteBooking = async (req, res)=>{
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

