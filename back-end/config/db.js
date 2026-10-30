const mongoose = require("mongoose");

let databaseConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    databaseConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    databaseConnected = false;
    console.warn(`MongoDB unavailable: ${error.message}`);
    return null;
  }
};

const isDatabaseConnected = () => databaseConnected || mongoose.connection.readyState === 1;

module.exports = connectDB;
module.exports.isDatabaseConnected = isDatabaseConnected;