let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// connect to package model
let package = require('../model/package');

// Read - Display all packages CRUD Operation
router.get('/', async (req, res, next) => {
    try {
        const PackageList = await Package.find();
        res.render('Packages/list', {
            title: 'Packages',
            PackageList: PackageList
        });
    }
    catch (err) {
        console.log(err);
        res.render('Packages/list', {
            error: 'Error on the Server'
        });
    }
});

// Create - Display Add Form CRUD Operation
router.get('/add', async (req, res, next) => {
    try {
        res.render('Packages/add', {
            title: 'Add Package'
        });
    }
    catch (err) {
        console.log(err);
        res.render('Packages/list', {
            error: 'Error on the Server'
        });
    }
});

// Create - Process Add Fomr CRUD Operation
router.post('/add', async (req, res, next) => {
    try {
        let newPackage = Package({
            "name": req.body.name,
            "description": req.body.description,
            "price": req.body.price
        });

        await Package.create(newPackage);
        res.redirect('/packages');
    }
    catch (err) {
        console.log(err);
        res.render('Packages/list', {
            error: 'Error on the server'
        });
    }
});

// Update - Display Edit Form CRUD Operation
router.get('/edit/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const packageToEdit = await Package.findById(id);

        res.render("Packages/edit", {
            title: 'Edit Package',
            Package: packageToEdit
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});

// Update - Process Edit Form
router.post('/edit/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        let updatedPackage = Package({
            "_id": id,
            "name": req.body.name,
            "description": req.body.description,
            "price": req.body.price
        });

        await Package.findByIdAndUpdate(id, updatedPackage);
        res.redirect("/packages");
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});

// Delete - Remove Package CRUD Uperation
router.get('/delete/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        await Package.deleteOne({ _id: id });
        res.redirect("/packages");
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;