const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("DB connection successfully");
    })
    .catch((error) => {
        console.log("DB connection issues");
        console.error(error);
        process.exit(1);
    });
};