import dotenv from 'dotenv';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Item } from './models/itemModel.js';
import { User } from "./models/userModel.js";


dotenv.config()

export const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }))


const connectionString = process.env.MONOGODB_URI || "";
const port = process.env.PORT || 8000;


app.get("/", (req, res) => {
  res.status(200).send("Welcome to express")
  // res.json({message: "Welcome to express"});
})

app.post("/items", async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.description
    ) {
      return res.status(400).send({
        message: "Send all required fields name, description"
      })
    }

    const newItem = {
      name: req.body.name,
      description: req.body.description
    };
    const item = await Item.create(newItem);

    return res.status(201).send(item);
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error.message })
  }
})


app.get("/items", async (req, res) => {
  try {
    const items = await Item.find({});
    return res.status(200).json(items);
  } catch (error) {
    console.log(error.message)
    res.status(500).send({ message: error.message })
  }
})


app.post("/create", async (req, res) => {

  const { email, login, password, cpassword } = req.body;

  try {
    if (
      !email ||
      !login ||
      !password ||
      !cpassword
    ) {
      return res.status(400).send({
        message: "Send all required fields name, description"
      })
    }

    const user = await User.findOne({ email }).exec();

    if (user) {
      return res.status(400).send({ message: "User already exists" })
    } else {
      const newUserDetails = {
        email: req.body.email,
        login: req.body.login,
        password: req.body.password,
        cpassword: req.body.cpassword
      };

      const newUser = await User.create(newUserDetails);

      return res.status(201).send({ message: "Your account is in queue, pls validate"});
      // return res.status(201).send(newUser);
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error.message })
  }
})


app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.log(error.message)
    res.status(500).send({ message: error.message })
  }
})


app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message)
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





mongoose
  .connect(connectionString)
  .then(() => {
    console.log("App connected to database");
    app.listen(port, () => console.log(`Listening to port ${port}`));
  })
  .catch((error) => {
    console.log(error);
  });



