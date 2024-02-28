import dotenv from 'dotenv';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Item } from '../models/itemModel.js';


dotenv.config()

export const app = express();
app.use(express.json());
app.use(cors());


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

mongoose
.connect(connectionString)
.then(() => {
  console.log("App connected to database");
  app.listen(port, () => console.log(`Listening to port ${port}`));
})
.catch((error) => {
  console.log(error);
});



