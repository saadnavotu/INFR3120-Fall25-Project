let mongoose = require('mongoose')

// create model class
let bookingModel = mongoose.Schema({
    name: String,
    description: String,
    price: Number
},
{
    collection: "bookings"
});

module.exports = mongoose.model('Booking', bookingModel);