// This is Configuration file used for connect to database to server by mongoose;
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", true);

const connection = mongoose.connect(process.env.dbURL);

module.exports = { connection };