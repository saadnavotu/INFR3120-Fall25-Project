let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// connect to our booking model
let Booking = require('../model/booking');

function requireAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

// GET route for displaying all bookings --> Read Operation
router.get('/', async (req, res, next) => {
    try {
        const bookingList = await Booking.find().sort({ bookingDate: -1 });
        res.render('Bookings/list', {
            title: 'Bookings',
            bookingList: bookingList,
            displayName: req.user ? req.user.displayName : ""
        });
    } catch (err) {
        console.log(err);
        res.render('Bookings/list', {
            title: 'Bookings',
            bookingList: [],
            error: 'Error on the Server',
            displayName: req.user ? req.user.displayName : ""
        });
    }
});

// GET route for displaying the Add Booking Page Create Operation
router.get('/add', async (req, res, next) => {
    try {
        res.render('Bookings/add', {
            title: 'Add Booking',
            displayName: req.user ? req.user.displayName : ""
        });
    } catch (err) {
        console.log(err);
        res.render('Bookings/list', {
            error: 'Error on the Server',
            displayName: req.user ? req.user.displayName : ""
        });
    }
});

// POST route for processing the Add Booking Page --> Create Operation
router.post('/add', requireAuth, async (req, res, next) => {
    try {
        // basic server side validation
        if (!req.body.customerName || !req.body.customerPhone || !req.body.servicePackage || !req.body.bookingDate) {
            return res.render('Bookings/add', {
                title: 'Add Booking',
                error: 'Missing required fields',
                displayName: req.user ? req.user.displayName : ""
            });
        }

        let newBooking = Booking({
            customerName: req.body.customerName,
            customerPhone: req.body.customerPhone,
            customerEmail: req.body.customerEmail,
            vehicleMakeModel: req.body.vehicleMakeModel,
            vehiclePlate: req.body.vehiclePlate,
            servicePackage: req.body.servicePackage,
            bookingDate: req.body.bookingDate,
            durationHours: req.body.durationHours || 2,
            notes: req.body.notes
        });

        await Booking.create(newBooking);
        res.redirect('/bookings');
    } catch (err) {
        console.log(err);
        res.render('Bookings/add', {
            title: 'Add Booking',
            error: 'Error on the Server',
            displayName: req.user ? req.user.displayName : ""
        });
    }
});

// GET route for displaying the Edit Booking Page also know as the Update Operation
router.get('/edit/:id', requireAuth, async (req, res, next) => {
    try {
        const id = req.params.id;
        const bookingToEdit = await Booking.findById(id);
        res.render('Bookings/edit', {
            title: 'Edit Booking',
            booking: bookingToEdit,
            displayName: req.user ? req.user.displayName : "",
            error: null
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});


// POST route for processing the Edit Booking Page --> Update Operation
router.post('/edit/:id', requireAuth, async (req, res, next) => {
    try {
        const id = req.params.id;

        let updatedBooking = {
            _id: id,
            customerName: req.body.customerName,
            customerPhone: req.body.customerPhone,
            customerEmail: req.body.customerEmail,
            vehicleMakeModel: req.body.vehicleMakeModel,
            vehiclePlate: req.body.vehiclePlate,
            servicePackage: req.body.servicePackage,
            bookingDate: req.body.bookingDate,
            durationHours: req.body.durationHours || 2,
            notes: req.body.notes
        };

        await Booking.findByIdAndUpdate(id, updatedBooking);
        res.redirect('/bookings');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

// GET route for Delete Booking --> Delete Operation
router.get('/delete/:id', requireAuth, async (req, res, next) => {
    try {
        const id = req.params.id;
        await Booking.deleteOne({ _id: id });
        res.redirect('/bookings');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;
