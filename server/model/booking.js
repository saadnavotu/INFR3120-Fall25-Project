// Try to link the packages slection so admin can choose a service pacakge.

let mongoose = require('mongoose');

let BookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String },
  vehicleMakeModel: { type: String },
  vehiclePlate: { type: String },


//   here is where to link the service packages for admin access.
  servicePackageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },

  bookingDate: { type: Date, required: true },
  durationHours: { type: Number, default: 2 },

  status: {
    type: String,
    enum: ['pending','confirmed','completed','cancelled'],
    default: 'pending'
  },

  notes: { type: String }
},
{
  collection: "bookings",
  timestamps: true
});

module.exports = mongoose.model('Booking', BookingSchema);
