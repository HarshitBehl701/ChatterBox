const  mongoose = require("mongoose");

mongoose.connect(process.env.DB_STRING);

module.exports = mongoose.connection;