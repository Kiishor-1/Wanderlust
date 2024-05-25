const Razorpay = require('razorpay');
// const crypto  = require('crypto');
const Booking = require('../Models/Booking');


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});


module.exports.createOrder = async (req, res) => {
    // console.log("executed")
    const { amount } = req.body;
    if (!amount) {
        return res.status(400).json({ error: 'Amount is required' });
    }
    // console.log(amount);
    const options = {
        amount: amount * 100, // amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Failed to create Razorpay order' });
    }
}

module.exports.verifyPayment = async (req, res) => {
    // console.log("executed");
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookings } = req.body;

    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);

    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
        try {
            // Payment is successful, proceed with booking confirmation
            // Update your database with the booking details
            await Booking.updateMany(
                { _id: { $in: bookings } }, // Find all bookings with IDs in the `bookings` array
                { $set: { status: 'Paid' } } // Update the status of each booking to "Paid"
            );

            res.json({ success: true });
        } catch (error) {
            console.error("Error updating booking status:", error);
            res.json({ success: false, error: "Error updating booking status" });
        }
    } else {
        res.json({ success: false, error: "Invalid signature" });
    }
};

