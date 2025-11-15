let mongoose = require('mongoose')

// create model class
let packageModel = mongoose.Schema({
    name: String,
    description: String,
    price: Number
},
{
    collection: "packages"
});

module.exports = mongoose.model('Package', pacakgeModel);