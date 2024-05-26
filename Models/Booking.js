const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    status:{
        type:String,
        enum:["Unbooked","Booked","Paid"],
        default:"Unbooked",
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    paidAt: {
        type: Date
    }
});

module.exports = mongoose.model("Booking", bookingSchema);
