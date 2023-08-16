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

// mongoose.connect(DB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log('Connected to MongoDB Atlas');
// })
// .catch(err => {
//   console.error('Error connecting to MongoDB Atlas:', err);
// });


// my local server
mongoose.connect("mongodb://127.0.0.1:27017/artexDB");





// Models Importation
const User = require("./models/user");
const Category = require("./models/category");
const Product = require("./models/product");
const Cart = require("./models/cart");






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




////////////////////// Add Course //////////////////////////////
// add course
app.post("/api/course/add", multer({ storage: storageConfig }).fields([{ name: "img", maxCount: 1 }]), async (req, res) => {
  console.log("Course", req.body);

  try {
    
  const image = req.files["img"][0];

    req.body.img = `${req.protocol}://${req.get("host")}/myFiles/${image.filename}`;
   
    let course = new Course(req.body);
    await course.save();
    console.log("Success", course);

    res.json({ msg: "Added with success" });
  } catch (error) {
    console.error("Here Error", error);
    res.json({ msg: "Error" });
  }
});


//////////////////////////////get course by teacher id/////////////////
app.get("/api/course/:id", (req, res) => {
  console.log("here into get course by ID" ,req.params.id);
  let id = req.params.id;
  Course.find({ teacherId: id }).then((doc) => {
    res.json({ courses: doc });
  });
 
});

//////////////////////////////get course by id/////////////////
app.get("/api/course/one/:id", (req, res) => {
  let id = req.params.id;
  Course.findOne({ _id: id }).then((doc) => {
    console.log(doc)
    res.json({ course: doc });
  });
 
});

// Business Logic: Edit Course

app.put("/api/course", multer({ storage: storageConfig }).fields([{ name: "img", maxCount: 1 }]), (req, res) => {
  console.log("Here into BL: Edit course", req.files);
  
  if (req.files && req.files["img"]) {
    const image = req.files["img"][0];
    req.body.img = `${req.protocol}://${req.get("host")}/myFiles/${image.filename}`;
  }
  
  Course.updateOne({ _id: req.body._id }, req.body).then((response) => {
    if (response.nModified == "1") {
      res.json({ msg: "Updated with success" });
    } else {
      res.json({ msg: "Error" });
    }
  });
});

// Business Logic: Edit User

// app.put("/api/users/teacherEdit", multer({ storage: storageConfig }).fields([{ name: "img", maxCount: 1 }]), (req, res) => {
//   console.log("Here into BL: Edit Teacher", req.files["img"]);
//   console.log(req.body)
//   if (req.files && req.files["img"]) {
//     const image = req.files["img"][0];
//     req.body.img = `${req.protocol}://${req.get("host")}/myFiles/${image.filename}`;
//   }
  
//   Teacher.updateOne({ _id: req.body._id }, req.body).then((response) => {
//     if (response.nModified == "1") {
//       res.json({ msg: "Updated with success" });
//     } else {
//       res.json({ msg: "Error" });
//     }
//   });
// });
app.put("/api/users/teacherEdit", multer({ storage: storageConfig }).fields([{ name: "img", maxCount: 1 }]), (req, res) => {
  console.log("Here into BL: Edit Teacher", req.files["img"]);
  console.log(req.body);

  // Create an object to hold the fields to be updated
  const updatedFields = {};

  // Check which fields are sent from the frontend and add them to the updatedFields object
  if (req.body.firstName) {
    updatedFields.firstName = req.body.firstName;
  }

  if (req.body.lastName) {
    updatedFields.lastName = req.body.lastName;
  }

  if (req.body.address) {
    updatedFields.address = req.body.address;
  }

  // You can add more fields here based on what you want to update

  if (req.files && req.files["img"]) {
    const image = req.files["img"][0];
    updatedFields.img = `${req.protocol}://${req.get("host")}/myFiles/${image.filename}`;
  }

  // Now, update the teacher record in the database with the updated fields
  Teacher.updateOne({ _id: req.body._id }, { $set: updatedFields })
    .then((response) => {
      if (response.nModified === 1) {
        res.json({ msg: "Updated with success" });
      } else {
        res.json({ msg: "Error" });
      }
    })
    .catch((error) => {
      res.status(500).json({ msg: "Error updating the teacher." });
    });
});

app.put("/api/users/studentEdit", multer({ storage: storageConfig }).fields([{ name: "img", maxCount: 1 }]), (req, res) => {
  // Same code as in the other route handlers, with the necessary changes for the Student model
  // Create an object to hold the fields to be updated
  const updatedFields = {};

  // Check which fields are sent from the frontend and add them to the updatedFields object
  if (req.body.firstName) {
    updatedFields.firstName = req.body.firstName;
  }

  if (req.body.lastName) {
    updatedFields.lastName = req.body.lastName;
  }

  if (req.body.address) {
    updatedFields.address = req.body.address;
  }

  // You can add more fields here based on what you want to update

  if (req.files && req.files["img"]) {
    const image = req.files["img"][0];
    updatedFields.img = `${req.protocol}://${req.get("host")}/myFiles/${image.filename}`;
  }

  // Now, update the Student record in the database with the updated fields
  Student.updateOne({ _id: req.body._id }, { $set: updatedFields })
    .then((response) => {
      if (response.nModified === 1) {
        res.json({ msg: "Updated with success" });
      } else {
        res.json({ msg: "Error" });
      }
    })
    .catch((error) => {
      res.status(500).json({ msg: "Error updating the Student." });
    });
});

app.put("/api/users/adminEdit", multer({ storage: storageConfig }).fields([{ name: "img", maxCount: 1 }]), (req, res) => {
  // Same code as in the other route handlers, with the necessary changes for the Admin model
  // Create an object to hold the fields to be updated
  const updatedFields = {};

  // Check which fields are sent from the frontend and add them to the updatedFields object
  if (req.body.firstName) {
    updatedFields.firstName = req.body.firstName;
  }

  if (req.body.lastName) {
    updatedFields.lastName = req.body.lastName;
  }

  if (req.body.address) {
    updatedFields.address = req.body.address;
  }

  // You can add more fields here based on what you want to update

  if (req.files && req.files["img"]) {
    const image = req.files["img"][0];
    updatedFields.img = `${req.protocol}://${req.get("host")}/myFiles/${image.filename}`;
  }

  // Now, update the Admin record in the database with the updated fields
  Admin.updateOne({ _id: req.body._id }, { $set: updatedFields })
    .then((response) => {
      if (response.nModified === 1) {
        res.json({ msg: "Updated with success" });
      } else {
        res.json({ msg: "Error" });
      }
    })
    .catch((error) => {
      res.status(500).json({ msg: "Error updating the Admin." });
    });
});
app.put("/api/users/parentEdit", multer({ storage: storageConfig }).fields([{ name: "img", maxCount: 1 }]), (req, res) => {
  // Same code as in the Teacher route handler, with the necessary changes for the Parent model
  // Create an object to hold the fields to be updated
  const updatedFields = {};

  // Check which fields are sent from the frontend and add them to the updatedFields object
  if (req.body.firstName) {
    updatedFields.firstName = req.body.firstName;
  }

  if (req.body.lastName) {
    updatedFields.lastName = req.body.lastName;
  }

  if (req.body.address) {
    updatedFields.address = req.body.address;
  }

  // You can add more fields here based on what you want to update

  if (req.files && req.files["img"]) {
    const image = req.files["img"][0];
    updatedFields.img = `${req.protocol}://${req.get("host")}/myFiles/${image.filename}`;
  }

  // Now, update the Parent record in the database with the updated fields
  Parent.updateOne({ _id: req.body._id }, { $set: updatedFields })
    .then((response) => {
      if (response.nModified === 1) {
        res.json({ msg: "Updated with success" });
      } else {
        res.json({ msg: "Error" });
      }
    })
    .catch((error) => {
      res.status(500).json({ msg: "Error updating the Parent." });
    });
});


//////////////Delete Course by Id /////////////////
// Business Logic: Delete Course By Id
app.delete("/api/course/:id", (req, res) => {
  console.log("Here into BL: Delete  Course by id", req.params.id);
  Course.deleteOne({ _id: req.params.id }).then((response) => {
    response.deletedCount == 1
      ? res.json({ isDeleted: true })
      : res.json({ isDeleted: false });
  });
});
//////////// GET ALL Courses /////////////
app.get("/api/courses", (req, res) => {
  Course.find().then((doc) => {
    res.json({ Course: doc });
    console.log(res)
  });
 
});
///////////////get teacher for course////////////
app.get("/api/users/teacher/:id", (req, res) => {
  console.log("here into get teacher by ID" ,req.params.id);
  let id = req.params.id;
  Teacher.find({ _id: id }).then((doc) => {
    res.json({ Teacher: doc });
  });
 
});

//////////// GET ALL TEACHERS /////////////
app.get("/api/users/teachers/", (req, res) => {
  Teacher.find().then((doc) => {
    res.json({ Teacher: doc });
  });
 
});
//////////// GET Limeted TEACHERS /////////////

app.get("/api/users/teachers/limit", (req, res) => {
  Teacher.find().limit(3).then((doc) => {
    res.json({ Teacher: doc });
  });
 
});

//////////// GET Limeted Courses /////////////

app.get("/api/courses/limit", (req, res) => {
  Course.find().limit(3).then((doc) => {
    res.json({ Course: doc });
  });
 
});
//////////// GET ALL STUDENTS /////////////
app.get("/api/users/students/", (req, res) => {
  console.log("all students")
  Student.find().then((doc) => {
    res.json({ Student: doc });
  });
 
});
// Business Logic: Delete Teacher By Id
app.delete("/api/users/teacher/:id", (req, res) => {
  console.log("Here into BL: Delete  Teacher by id", req.params.id);
  Teacher.deleteOne({ _id: req.params.id }).then((response) => {
    response.deletedCount == 1
      ? res.json({ isDeleted: true })
      : res.json({ isDeleted: false });
  });
});

// Business Logic: Delete Student By Id
app.delete("/api/users/student/:id", (req, res) => {
  console.log("Here into BL: Delete  Teacher by id", req.params.id);
  Student.deleteOne({ _id: req.params.id }).then((response) => {
    response.deletedCount == 1
      ? res.json({ isDeleted: true })
      : res.json({ isDeleted: false });
  });
});
// Business Logic: get Student By Id
app.get("/api/users/student/:id", (req, res) => {
  console.log("Here into BL: get  student  by id", req.params.id);
  Student.findOne({ _id: req.params.id }).then((doc) => {
    res.json({ Student: doc })
  });
});


// Business Logic: get Student By child phone number
app.get("/api/users/student/child/:phone", (req, res) => {
  console.log("Here into BL: get  student  by number", req.params.phone);

  Student.findOne({ phone: req.params.phone }).then((doc) => {
    res.json({ Student: doc })
  });
});

app.put("/api/users/teacher/status/:id", (req, res) => {
 
  let id = req.params.id;
  console.log("here into req.body",req.body)
  Teacher.updateOne({ _id: id }, { $set: req.body }).then((result) => {
    console.log("Here result after update", result);
    result.nModified == 1
      ? res.json({ message: "Edited With Success" })
      : res.json({ message: "Echec" });
  });
});


////////// CREATE ENROLLMENT ////////

app.post("/api/course/enrollment", (req, res) => {
  console.log("Here into BL : add courseEnrollement" , req.body);
  let obj = new CourseEnrollment(req.body);
  obj.save();
  res.status(200).json({ message: "Added with success" });
});

///////////////get Enrolled course for a student /////////
app.get("/api/course/enrolled/:id", (req, res) => {
  console.log("here into get enrolled by ID" ,req.params.id);
  let id = req.params.id;
  CourseEnrollment.find({ studentId: id }).populate('courseId').then((doc) => {
  
    res.json({ enrolledCourses: doc , msg: "1"});
  });
 
});

///////////////get All Enrolled students /////////
app.get("/api/courses/allenrolled", (req, res) => {
  console.log("here into all enrolled")
  CourseEnrollment.find().then((doc) => {
    res.json({ Enrollments: doc });
  });
 
});

///////////////get All Enrolled students by course /////////
app.get("/api/courses/selectedCourse/:id", (req, res) => {

  console.log("here into get selected course enrollment by ID" ,req.params.id);
  let id = req.params.id;
  CourseEnrollment.find({ courseId: id }).populate('courseId').populate('studentId').then((doc) => {
    res.json({ Enrollments: doc });
  });
 
});
///////////////get All enrollments by Id /////////

app.get("/api/courses/selectedEnrollement/:id", (req, res) => {

  console.log("here into get All enrollments by Id" ,req.params.id);
  let id = req.params.id;
  CourseEnrollment.find({ _id: id }).populate('courseId').populate('studentId').then((doc) => {
    res.json({ Enrollments: doc });
  });
 
});
app.get("/api/courses/studentEnrollement/:id", (req, res) => {

  console.log("here into get All enrollments by Id" ,req.params.id);
  let id = req.params.id;
  CourseEnrollment.find({ studentId: id }).populate('courseId').populate('studentId').then((doc) => {
    res.json({ Enrollments: doc });
  });
 
});

////////// CREATE/SAVE SCORE ////////

// app.post("/api/course/score", (req, res) => {
//   console.log("Here into BL : add score" , req.body);
//   let score = new Score(req.body);
//   score.save();
//   res.status(200).json({ message: "Added with success" });
// });
app.post("/api/course/score", (req, res) => {
  console.log("Here into BL: add score", req.body);

  // Check if a score object with the same enrollment ID already exists
  Score.findOne({ enrollmentId: req.body.enrollmentId }).then((existingScore) => {
    if (existingScore) {
      // A score for the enrollment already exists
      return res.json({ error: "Score for the enrollment already exists" });
    }

    // No existing score, create a new one and save it
    let score = new Score(req.body);
   score.save();
  res.status(200).json({ message: "Added with success" });
 });
  });

  ///////////////get All Scores /////////
  app.get("/api/courses/scoring", (req, res) => {
    console.log("here into all scoring")
    
    Score.find().populate('enrollmentId').then((doc) => {
      res.json({ scores: doc });
    });
  
});
  app.get("/api/courses/scoringByStudent", (req, res) => {
    console.log("here into all scoring")
    let id = req.params.id;
    Score.find({enrollmentId: id}).populate('enrollmentId').then((doc) => {
      res.json({ scores: doc });
    });
  
});

////////search for teacher by specialty //////
app.get("/api/users/searchTeacher/:specialty", (req, res) => {
  console.log("Here into BL : Search ALl teachers", req.params.specialty);
  const specialty = req.params.specialty
  Teacher.find({specialty: { $regex: new RegExp(specialty, "i") }}).then((docs) => {
    res.json({ foundedTeachers: docs, msg: "Done" });
  });
});
/// FIND ANY USER BY ID 
app.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  console.log("Here into BL: get user by id", userId);

  Promise.all([
    Student.findOne({ _id: userId }),
    Parent.findOne({ _id: userId }),
    Teacher.findOne({ _id: userId }),
    Admin.findOne({ _id: userId })
  ]).then(([student, parent, teacher, admin]) => {
    const user = student || parent || teacher || admin;
    res.json({ user });
  }).catch((error) => {
    res.status(500).json({ message: 'Error fetching user by ID' });
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

app.post('/api/cart/add', async (req, res) => {
  try {
    console.log(req.body.productId)
    const newCartItem = req.body;
    const existingCartItem = await Cart.findOne({ productId: newCartItem.productId });

    if (existingCartItem) {
      console.log("exist")
      // If the item already exists in the cart, increase the quantity
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

app.delete('/api/cart/:productId', async (req, res) => {
  try {
    console.log("here into deleting item from cart",req.params.productId)
    const productId = req.params.productId;
    await Cart.findOneAndDelete({ productId });
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


module.exports = app;


