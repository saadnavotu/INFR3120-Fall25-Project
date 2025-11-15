// load .env 
require('dotenv').config(); 

const mongoose = require("mongoose");

const connectionString = process.env.MONGO_URI;

// connect to mongodb
mongoose.connect(connectionString)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDb Connection Error:", err));

module.exports = mongoose;