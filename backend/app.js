// import express module
const express = require("express");
// import body parser module
const bodyParser = require("body-parser");
//import bcrypt module
const bcrypt = require("bcrypt");
// import multer module
const multer = require("multer");
// import path module
const path = require("path");
// import axios module
const axios  = require("axios");
// import jwt module
const jwt = require('jsonwebtoken');
// import express-session module
const session = require('express-session');


// import mongoose module
const mongoose = require('mongoose');
const app = express();

const DB_URI = 'mongodb+srv://xetradepot:artex92@cluster0.l7w3zgd.mongodb.net/';

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch(err => {
  console.error('Error connecting to MongoDB Atlas:', err);
});


// my local server
// mongoose.connect("mongodb://127.0.0.1:27017/artexDB");





// Models Importation
const User = require("./models/user");
const Category = require("./models/category");
const Product = require("./models/product");
const Cart = require("./models/cart");
const Order = require('./models/order');







//Appliction Congfig
// confi body-parser (1_EXTRACT OBJECT FROM REQUEST., 2_send JSON RESPONSE)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Security configuration

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-with, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, OPTIONS, PATCH, PUT"
  );
  next();
});

//session config
const secretKey = 'ayoub92';
app.use(
  session({
secret: secretKey,
})
);

// ShortCut

app.use("/myFiles", express.static(path.join("backend/files")));

// Media
const MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "application/pdf": "pdf", // Add MIME type for PDF
};

const storageConfig = multer.diskStorage({
  // destination
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype];
    let error = new Error("Mime type is invalid");
    if (isValid) {
      error = null;
    }
    cb(null, "backend/files"); // Update destination folder
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extension = MIME_TYPE[file.mimetype];
    const fileName = name + "-" + Date.now() + "-artex-" + "." + extension; // Update variable name
    cb(null, fileName);
  },
});


//////////////////// SIGNUP /////////////////////////


// Business Logic: User signup
app.post("/api/users/signup/user", multer({ storage: storageConfig }).fields([{ name: "img", maxCount: 1 }]), async (req, res) => {
  console.log("Here into Signup User", req.body);

  try {
    const cryptedPwd = await bcrypt.hash(req.body.pwd, 10);
    console.log("Here crypted Pwd", cryptedPwd);
    req.body.pwd = cryptedPwd;

    const image = req.files["img"][0];

    req.body.img = `${req.protocol}://${req.get("host")}/myFiles/${image.filename}`;
   
    let user = new User(req.body);
    await user.save();
    console.log("Success", user);

    res.json({ msg: "Added with success" });
  } catch (error) {
    console.error("Here Error", error);
    res.json({ msg: "Error" });
  }
});

// Business Logic: User login
app.post("/api/users/login", (req, res) => {
  console.log("Here Into BL login", req.body);

  User.findOne({ phone: req.body.phone })
    .then((user) => {
      if (!user) {
        console.log("User not found");
        res.json({ msg: "Please check phone" });
      } else {
        bcrypt.compare(req.body.pwd, user.pwd, (err, isEqual) => {
          if (err) {
            console.log("Error comparing passwords:", err);
            res.json({ msg: "An error occurred" });
          } else if (isEqual) {
            console.log("Passwords match");
            let userToSend = {
              userId: user._id,
              email: user.email,
              Fname: user.firstName,
              Lname: user.lastName,
              add: user.address,
              img: user.img,
              role: user.role,
              status: user.status,
            };

            const token = jwt.sign(userToSend, secretKey, {
              expiresIn: "1h"
            });
            res.json({ user: token, role: user.role, msg: "2" });
          } else {
            console.log("Passwords do not match");
            res.json({ msg: "Please check Password" });
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ msg: "An error occurred" });
    });
});




//////////////////////////////////////////////////////////////////////////////////

/////////////////////////// ADD CATEGORY ////////////////////////////////////////
app.post("/api/category/add", (req, res) => {
  console.log("Here into BL : add category" , req.body);
  let category = new Category(req.body);
  category.save();
  res.status(200).json({ message: "Added with success" });
});

/////////////////////////// GET ALL CATEGORY ////////////////////////////////////////
app.get("/api/category/get/all", (req, res) => {
  Category.find().then((doc) => {
    res.json({ category: doc });
    console.log(res)
  });
 
});

/////////////////////////// ADD Product ////////////////////////////////////////

app.post("/api/product/add", multer({ storage: storageConfig }).fields([{ name: "img", maxCount: 1 }]), async (req, res) => {
  try {
    console.log("Here into BL: add product", req.body);

    const image = req.files["img"][0];

    req.body.img = `${req.protocol}://${req.get("host")}/myFiles/${image.filename}`;

    const product = new Product(req.body);
    await product.save();
    console.log("Success", product); // Changed from 'user' to 'product'

    res.json({ msg: "Added with success" });
  } catch (error) {
    console.error("Here Error", error);
    res.json({ msg: "Error" });
  }
});


/////////////////////////// GET ALL products ////////////////////////////////////////
app.get("/api/products/get/all", (req, res) => {
  Product.find().populate('categoryId').then((doc) => {
    res.json({ products: doc });
    console.log(res)
  });
 
});

/////////////////////////// CART ////////////////////////////////////////
app.get('/api/cart/:userId', async (req, res) => {
  try {
    console.log("here into get cart items by userId",req.params)
    const userId = req.params.userId; // Get userId from the query parameter
    console.log("here into get cart items for userId:", userId);

    // Find cart items with the specified userId
    const cartItems = await Cart.find({ userId })
      .populate('productId')
      .populate('categoryId')
      .populate('userId')
      .exec();

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/////////////////////////// orders ////////////////////////////////////////
app.get('/api/orders/:userId', async (req, res) => {
  try {
    console.log("here into get cart items by userId",req.params)
    const userId = req.params.userId; // Get userId from the query parameter
    console.log("here into get cart items for userId:", userId);

    // Find cart items with the specified userId
    const orderItems = await Order.find({ userId })
    .populate('userId') // Populate userId and select username
    .populate('items.productId') // Populate productId and select productName
    .populate('items.categoryId'); // Populate categoryId and select categoryName
    
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/cart/add', async (req, res) => {
  try {
    console.log(req.body.productId)
    console.log(req.body.userId)
    const newCartItem = req.body;
    const existingCartItem = await Cart.findOne({ productId: newCartItem.productId ,userId: newCartItem.userId } );

    if (existingCartItem) {
      console.log("exist");
      // If the item already exists in the cart with the same productId and userId, increase the quantity
      existingCartItem.quantity += newCartItem.quantity;
      await existingCartItem.save();
      res.status(200).json(existingCartItem);
    } else {
      // If the item doesn't exist, create a new cart item
      const createdCartItem = await Cart.create(newCartItem);
      res.status(201).json(createdCartItem);
    }
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
});

/////////////// deleting cart by userID/////////////////
app.delete('/api/itemsDeleted/:userId', async (req, res) => {
  try {
    console.log("here into deleting all cart items from cart", req.params.userId);
    const userId = req.params.userId;
    const result = await Cart.deleteMany({ userId: userId });
    
    if (result.deletedCount > 0) {
      console.log("Items deleted successfully.");
      res.json({ message: 'cart deleted' });
    } else {
      console.log("No items found for deletion.");
      res.json({ message: 'no items to delete' });
    }
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.delete('/api/cart/:categoryId', async (req, res) => {
  try {
    console.log("here into deleting item from cart",req.params.categoryId)
    const categoryId = req.params.categoryId;
    await Cart.findOneAndDelete({ _id:categoryId });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.put('/api/update-quantity', (req, res) => {
  console.log("here into update quantity", req.params)
  console.log("here into update quantity", req.body.itemId)
  
  const itemId = req.body.itemId; // Correct way to extract itemId
  const newQuantity = req.body.newQuantity; // Correct way to extract newQuantity

  Cart.updateOne({ _id: itemId }, { $set: { quantity: newQuantity } }).then(result => {
    if (result.nModified === 1) {
      res.status(200).json({ message: 'Quantity updated successfully' });
    } 
  }).catch(error => {
    res.status(500).json({ message: 'Error updating quantity' });
  });
});
///////////////////////////////add order//////////////////////
app.post("/api/order/add", (req, res) => {
  console.log("Here into BL : add order" , req.body);
  let order = new Order(req.body);
  order.save();
  res.status(200).json({ message: "Added with success" });
});









module.exports = app;


