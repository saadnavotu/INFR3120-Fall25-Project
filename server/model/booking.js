// Import mongoose to define a schema/model


let mongoose = require('mongoose')
// Schema for storing booking information

let bookingModel = mongoose.Schema({
 // Customer details, car detials, dates, duriation

   
    customerName: String,
    customerPhone: String,
    customerEmail: String,
    vehicleMakeModel: String,
    vehiclePlate: String,
    servicePackage: String,
    bookingDate: Date,
    durationHours: Number,
    notes: String,
    status: { type: String, default: 'pending' }
    // addint to mongo db collecion
}, { collection: "bookings" });

module.exports = mongoose.model('Booking', bookingModel);
