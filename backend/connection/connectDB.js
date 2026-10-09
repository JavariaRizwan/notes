

const mongoose = require("mongoose");
require("dotenv").config();

let cached = null;

const connectDB = async () => {
  if (cached) return cached;
  cached = mongoose.connect(process.env.MONGODB_URI).catch((err) => {
    cached = null;
    console.error("Mongodb Connection failed", err.message);
    throw err;
  });
  await cached;
  console.log("Mongodb connected successfully");
  return cached;
};

module.exports = connectDB;