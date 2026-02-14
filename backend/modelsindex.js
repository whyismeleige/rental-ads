const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./usermodel");
db.listing = require("./listingmodel");

module.exports = db;