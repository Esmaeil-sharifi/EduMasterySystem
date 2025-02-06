// // This is Configuration file used for connect to database to server by mongoose;
// const mongoose = require("mongoose");
// require("dotenv").config();
// mongoose.set("strictQuery", true);

// const connection = mongoose.connect('mongodb+srv://EduMasterysystem:saghi1234@cluster1.smteuep.mongodb.net/');

// module.exports = { connection };
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", true);

const MONGO_URI = process.env.dbURL;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected Successfully...");
    } catch (err) {
        console.error("❌ Unable to connect to DB:", err.message);
        process.exit(1); 
    }
};

connectDB();

module.exports = { connectDB };
