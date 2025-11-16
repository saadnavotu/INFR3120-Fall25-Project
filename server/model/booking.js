let mongoose = require('mongoose')

let bookingModel = mongoose.Schema({
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
}, { collection: "bookings" });

module.exports = mongoose.model('Booking', bookingModel);
