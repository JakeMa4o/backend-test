import dotenv from 'dotenv';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// import { Item } from '../models/itemModel.js';
import { User } from "../models/userModel.js";
import { ValidateUser } from "../models/validateUserModel.js";


dotenv.config()

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }))


const connectionString = "mongodb+srv://jake:152456zh@cluster0.i4nndvp.mongodb.net/"
const port = process.env.PORT || 8000;


app.get("/", (req, res) => {
  res.status(200).send("Welcome to express")
  // res.json({message: "Welcome to express"});
})


app.post("/create", async (req, res) => {

  const { email, login, password, cpassword } = req.body;

  try {
    if (!email || !login || !password || !cpassword) {
      return res.status(422).send({
        message: "Send all required fields name, description"
      })
    }

    const user = await User.findOne({ email }).exec();

    const userInValidate = await ValidateUser.findOne({ email }).exec();

    if (user || userInValidate) {
      return res.status(400).send({ message: "User already exists" })
    } else {

      // Create 4 digit random number later ull secure it with bycript
      // I am not sure if the number has the be unqiue throughout the database what are best practices
      // Also there tokens and such I gotta learn as well
      // After verification the digit must be deleted to not take up the free space


      // Also gmail api integration
      const val = Math.floor(1000 + Math.random() * 9000);

      const UserValidationDetails = {
        email: req.body.email,
        login: req.body.login,
        password: req.body.password,
        cpassword: req.body.cpassword,
        validationCode: val
      };

      const userToValidate = await ValidateUser.create(UserValidationDetails);

      return res.status(201).send({ message: "Your account is in queue, pls validate" });
      // return res.status(201).send(newUser);
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error.message })
  }
})


app.post("/validate", async (req, res) => {
  const { email, validationCode } = req.body;

  try {
    if (!email || !validationCode) {
      return res.status(422).send({ message: "Send all required fields name, description" })
    } 

    const validateUser = await ValidateUser.findOne({ email }).exec();

    if (validateUser && validateUser.validationCode == validationCode) {

      const newUserDetails = {
        email: validateUser.email,
        login: validateUser.login,
        password: validateUser.password,
        cpassword: validateUser.cpassword,
      };

      const newUser = await User.create(newUserDetails);
      const deletedUser = await ValidateUser.deleteOne(validateUser);
      res.status(200).send({ message: "Your account has been successfully created!" })
    } else {
      res.status(401).send({ message: "Wrong credentials" })
    }

  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error.message })
  }

})


app.post("/login", async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ login, password }).exec();

    if (!user) {
      res.status(404).send({ message: "User not found" })
    } else {
      res.status(200).send({ message: "Welcome back" })
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).send({ message: error.message })
  }
})




// Test

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.log(error.message)
    res.status(500).send({ message: error.message })
  }
})


// app.get("/users/:id", async (req, res) => {
//   try {
//     const { id } = req.params
//     const user = await User.findById(id);
//     return res.status(200).json(user);
//   } catch (error) {
//     console.log(error.message)
//     res.status(500).send({ message: error.message })
//   }
// })


mongoose
  .connect(connectionString)
  .then(() => {
    console.log("App connected to database");
    app.listen(port, () => console.log(`Listening to port ${port}`));
  })
  .catch((error) => {
    console.log(error);
  });


export default app;