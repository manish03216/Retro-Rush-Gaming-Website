// const express = require('express')   // this is use in old js and for this require we use "type":"commonjs" in package.json file
import express from "express"; //this modern way of js in this we use import and for this we use "type":"module" in package.json file
import dotenv from "dotenv";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";

import userRoute from "./routes/user.route.js";

const app = express();
dotenv.config();

const port = process.env.PORT;
const MONOGO_URL = process.env.MONOG_URI;
// console.log(MONONO_URL);

//middleware
app.use(express.json());    //this is use to convert json data into object

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));

// app.get('/', (req, res) => {
//   res.send('Hello how are you jogi sahab')
// })

// DB Code

try {
  mongoose.connect(MONOGO_URL);
  console.log("Connected to mongoDb");
} catch (error) {
  console.log(error);
}

//defining routes
app.use("/api/user", userRoute);

//CLOUDINARY CONFIGURATION
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
