// import mongoose module

const mongoose = require("mongoose");

// import mongoose validaitor
const uniqueValidator = require('mongoose-unique-validator');


// Create user Schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {type: String, unique: true},
  pwd: String,
  address: String,
  phone: {type: String, unique: true},
  childPhone: String,
  img: String,
  role: String,

});

 // Apply the uniqueValidator plugin to userSchema.
userSchema.plugin(uniqueValidator);



// Create Model Name "user"
const user = mongoose.model("User", userSchema);

// Make user Exportable
module.exports = user;
