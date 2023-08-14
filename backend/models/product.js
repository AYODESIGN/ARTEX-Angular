// import mongoose module

const mongoose = require("mongoose");

// import mongoose validaitor
const uniqueValidator = require('mongoose-unique-validator');


// Create product Schema
const productSchema = mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  colorRef: String,
  designRef: String,
  quantity: Number,
  available: String,
  img: String,
  

});

 // Apply the uniqueValidator plugin to productSchema.
productSchema.plugin(uniqueValidator);



// Create Model Name "product"
const product = mongoose.model("Product", productSchema);

// Make product Exportable
module.exports = product;
