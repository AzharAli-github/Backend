const mongoose = require("mongoose");
require('dotenv').config();

const DA = process.env.DATABASE_URL;

mongoose.connect(DA).then(() => {
    console.log("Connection Successful");
}).catch((err) => {
    console.log("No Connection");
    console.log("Error details:", err.message);
});

module.exports = mongoose;