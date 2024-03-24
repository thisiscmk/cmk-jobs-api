const mongoose = require('mongoose')
const url = process.env.MONGODB_URL;

const connectDB = (url) => {
  return mongoose.connect(url);
}

module.exports = connectDB

