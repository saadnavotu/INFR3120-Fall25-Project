let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

//connecting the the 2 models booking and packages.
let Booking = require('../model/booking');
let Package = require('../model/package');

// READ – Display all bookings
router.get('/', async (req, res, next) => {
  try {
    const bookingList = await Booking.find().populate('servicePackageId').sort({ bookingDate: -1 });
    res.render('Bookings/list', {
      title: 'Bookings',
      bookingList: bookingList
    });
  }
  catch (err) {
    console.log(err);
    res.render('Bookings/list', { error: 'Error on the Server' });
  }
});

// CREATE – Display Add Form
router.get('/add', async (req, res, next) => {
  try {
    const packages = await Package.find();
    res.render('Bookings/add', { title: 'Add Booking', packages });
  }
  catch (err) {
    console.log(err);
    res.render('Bookings/list', { error: 'Error on the Server' });
  }
});

// CREATE – Process Add Form
router.post('/add', async (req, res, next) => {
  try {
    // basic server-side validation
    if (!req.body.customerName || !req.body.customerPhone || !req.body.servicePackageId || !req.body.bookingDate) {
      return res.render('Bookings/add', { error: 'Missing required fields', packages: await Package.find() });
    }

    let newBooking = Booking({
      customerName: req.body.customerName,

      customerPhone: req.body.customerPhone,

      customerEmail: req.body.customerEmail,

      vehicleMakeModel: req.body.vehicleMakeModel,
      
      servicePackageId: req.body.servicePackageId,

      bookingDate: req.body.bookingDate,
      
      durationHours: req.body.durationHours || 2,
      
      notes: req.body.notes
    });

    await Booking.create(newBooking);
    res.redirect('/bookings');
  }
  catch (err) {
    console.log(err);
    res.render('Bookings/add', { error: 'Error on the server', packages: await Package.find() });
  }
});