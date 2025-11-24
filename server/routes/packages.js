let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// connect to package model
let Package = require('../model/package');

// READ – Display all packages
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
        res.render('Packages/list', { error: 'Error on the Server' });
    }
});

// CREATE – Display Add Form
router.get('/add', async (req, res, next) => {
    try {
        res.render('Packages/add', { title: 'Add Package' });
    }
    catch (err) {
        console.log(err);
        res.render('Packages/list', { error: 'Error on the Server' });
    }
});

// CREATE – Process Add Form
router.post('/add', async (req, res, next) => {
    try {
        let newPackage = Package({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        });

        await Package.create(newPackage);
        res.redirect('/packages');
    }
    catch (err) {
        console.log(err);
        res.render('Packages/list', { error: 'Error on the server' });
    }
});

// UPDATE – Display Edit Form
router.get('/edit/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const packageToEdit = await Package.findById(id);

        res.render('Packages/edit', {
            title: 'Edit Package',
            Package: packageToEdit
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});

// UPDATE – Process Edit Form
router.post('/edit/:id', async (req, res, next) => {
    try {
        const id = req.params.id;

        let updatedPackage = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        };

        await Package.findByIdAndUpdate(id, updatedPackage);
        res.redirect('/packages');
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});

// DELETE – Remove Package
router.get('/delete/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        await Package.deleteOne({ _id: id });
        res.redirect('/packages');
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;
