// import mongoose module
const mongoose = require("mongoose");

// import mongoose validator
const uniqueValidator = require('mongoose-unique-validator');

// Create order Schema
const orderSchema = mongoose.Schema({
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    quantity: Number
  }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now } // Add a date field with default value
});
// Apply the uniqueValidator plugin to orderSchema.
orderSchema.plugin(uniqueValidator);

// Create Model Name "Order" (capitalized convention)
const Order = mongoose.model("Order", orderSchema);

// Make Order Exportable
module.exports = Order;
