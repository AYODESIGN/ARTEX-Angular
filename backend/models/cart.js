// import mongoose module

const mongoose = require("mongoose");

// import mongoose validaitor
const uniqueValidator = require('mongoose-unique-validator');


// Create cart Schema
const cartSchema = mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quantity: Number,
 
  

});

 // Apply the uniqueValidator plugin to cartSchema.
cartSchema.plugin(uniqueValidator);



// Create Model Name "cart"
const cart = mongoose.model("Cart", cartSchema);

// Make cart Exportable
module.exports = cart;
