// import mongoose module

const mongoose = require("mongoose");

// import mongoose validaitor
const uniqueValidator = require('mongoose-unique-validator');


// Create category Schema
const categorySchema = mongoose.Schema({
  categoryName: String,
  width: String,
  weight: String,
  length: String,
  composition: String,
  description: String,
  

});

 // Apply the uniqueValidator plugin to categorySchema.
categorySchema.plugin(uniqueValidator);



// Create Model Name "category"
const category = mongoose.model("Category", categorySchema);

// Make category Exportable
module.exports = category;
