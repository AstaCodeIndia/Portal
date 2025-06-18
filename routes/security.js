const mongoose = require("mongoose");

// Connect to IT database
const securityConnection = mongoose.createConnection('mongodb+srv://astacodeindia:indiancompany01@cluster0.epd66cc.mongodb.net/Security?retryWrites=true&w=majority&appName=Cluster0');
//  const securityConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/Security');

// Schema for 9th class
const ninthclassSchema = new mongoose.Schema({
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

const SecurityNinthClass = securityConnection.model('9th-class', ninthclassSchema);

module.exports = { SecurityNinthClass };
