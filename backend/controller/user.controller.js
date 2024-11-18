import { User } from "../model/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookies from "../jwt/AuthToken.js";

export const register = async (req, res) => {
  // console.log("Hello I am register method...")
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json({ message: "User profile picture is required" });
    }
    const { photo } = req.files;
    const allowedFormates = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormates.includes(photo.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo formate.Ony jpeg and png are allowed",
      });
    }
    const { Username, email, password } = req.body; //to get data from front end body in json format
    // console.log(hashedPassword);
    if (!Username || !email || !password || !photo) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
      photo.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      Username,
      email,
      password: hashedPassword,
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      },
    });
    await newUser.save(); //here we use async await because it take some time to save data in database
    if (newUser) {
      const token = await createTokenAndSaveCookies(newUser._id, res);
      return res.status(201).json({
        message: "User registered successfully",
        newUser,
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
  // console.log(Username);
  // console.log(email);
  // console.log(password);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user.password) {
      return res.status(400).json({ message: "User password is missing" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = await createTokenAndSaveCookies(user._id, res);
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        Username: user.Username,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
