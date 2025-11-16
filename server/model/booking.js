let mongoose = require('mongoose');

let BookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String },

  vehicleMakeModel: { type: String },

  // linked service package
  servicePackageId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Package', 
    required: true 
  },

  bookingDate: { type: Date, required: true },
  durationHours: { type: Number, default: 2 },

  notes: { type: String }
},
{
  collection: "bookings",
  timestamps: true
});

module.exports = mongoose.model('Booking', BookingSchema);
