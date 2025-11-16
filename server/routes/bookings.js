let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

//connecting the booking in models/bookings
let Booking = require('../model/booking');

// READ – Display all bookings
router.get('/', async (req, res, next) => {
  try {
    // dont need servicePackageId since we store the package as a string now
    const bookingList = await Booking.find().sort({ bookingDate: -1 });
    res.render('Bookings/list', {
      title: 'Bookings',
      bookingList: bookingList
    });
  }
  catch (err) {
    console.log(err);
    // send empty array so EJS doesn't crash
    res.render('Bookings/list', { 
      title: 'Bookings',
      bookingList: [],
      error: 'Error on the Server' 
    });
  }
});


// CREATE Display Add Form
router.get('/add', async (req, res, next) => {
  try {
    // No more fetching packages from DB
    res.render('Bookings/add', { title: 'Add Booking' });
  }
  catch (err) {
    console.log(err);
    res.render('Bookings/list', { error: 'Error on the Server' });
  }
});

// CREATE – Process Add Form
router.post('/add', async (req, res, next) => {
  try {
    // basic server side validation
    if (!req.body.customerName || !req.body.customerPhone || !req.body.servicePackage || !req.body.bookingDate) {
      return res.render('Bookings/add', { error: 'Missing required fields' });
    }

    let newBooking = Booking({
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone,
      customerEmail: req.body.customerEmail,
      vehicleMakeModel: req.body.vehicleMakeModel,
      servicePackage: req.body.servicePackage, // now stored as string
      bookingDate: req.body.bookingDate,
      durationHours: req.body.durationHours || 2,
      notes: req.body.notes
    });

    await Booking.create(newBooking);
    res.redirect('/bookings');
  }
  catch (err) {
    console.log(err);
    res.render('Bookings/add', { error: 'Error on the server' });
  }
});

// UPDATE – display Edit Form
router.get('/edit/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const bookingToEdit = await Booking.findById(id);

    
    res.render('Bookings/edit', {
      title: 'Edit Booking',
      booking: bookingToEdit
    });
  }
  catch (err) {
    console.log(err);
    next(err);
  }
});

// UPDATE – process Edit Form
router.post('/edit/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    let updatedBooking = {
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone,
      customerEmail: req.body.customerEmail,
      vehicleMakeModel: req.body.vehicleMakeModel,
      servicePackage: req.body.servicePackage, // updated as string
      bookingDate: req.body.bookingDate,
      durationHours: req.body.durationHours || 2,
      notes: req.body.notes
    };

    await Booking.findByIdAndUpdate(id, updatedBooking);
    res.redirect('/bookings');
  }
  catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
