const mongoose = require("mongoose");

const itConnection = mongoose.createConnection('mongodb+srv://astacodeindia:indiancompany01@cluster0.epd66cc.mongodb.net/IT?retryWrites=true&w=majority&appName=Cluster0');
// const itConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/IT');

// Schema for 9th class
const ninthclassSchema = new mongoose.Schema({
  fullname: String,
  fathername: String,
  mothername: String,
  gender: String,
  category: String,
  adhaar: {
    type: String,
    required: true,
    unique: true, // 🛡️ This ensures no duplicate Aadhaar
  },
  sssmID: String,
  dob: String,
  rollNumber: String,
  marks: Number,
  stream: String,
  email: String,
  phone: String,
  address: String,
})

// Schema for 11th class
const eleventhclassSchema = new mongoose.Schema({
  fullname: String,
  fathername: String,
  mothername: String,
  gender: String,
  category: String,
  adhaar: {
    type: String,
    // required: true,
    // unique: true,
  },
  sssmID: String,
  dob: String,
  rollNumber: String,
  marks: Number,
  stream: String,
  email: String,
  phone: String,
  address: String,
})

const ITNinthClass = itConnection.model('9th-class', ninthclassSchema);
const ITEleventhClass = itConnection.model('11th-class', eleventhclassSchema);

module.exports = { ITNinthClass, ITEleventhClass };
