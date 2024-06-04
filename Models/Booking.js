const mongoose = require("mongoose");
const Schema = mongoose.Schema;



// const guestSchema = new Schema({
//     adults: {
//         type: Number,
//         required: true,
//         default: 1
//     },
//     children: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     infants: {
//         type: Number,
//         required: true,
//         default: 0
//     }
// }, { _id: false });

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
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    // guests: {
    //     type: guestSchema,
    //     required: true
    // },
    totalRent: {
        type: Number,
        required: true
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



























// const bookingSchema = new Schema({
//     user: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     listing: {
//         type: Schema.Types.ObjectId,
//         ref: 'Listing',
//         required: true
//     },
//     status:{
//         type:String,
//         enum:["Unbooked","Booked","Paid"],
//         default:"Unbooked",
//         required:true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     paidAt: {
//         type: Date
//     }
// });

// module.exports = mongoose.model("Booking", bookingSchema);
