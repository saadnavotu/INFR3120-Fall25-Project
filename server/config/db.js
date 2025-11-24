require('dotenv').config(); 

const mongoose = require("mongoose");

const connectionString = process.env.MONGO_URI;

mongoose.connect(connectionString)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDb Connection Error:", err));

module.exports = mongoose;