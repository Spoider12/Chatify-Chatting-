<<<<<<< HEAD

import User from "../models/User.js";
=======
/*import User from "../models/User.js";
>>>>>>> f9bbb5fe930816781ce20dc29a171b16f673d5d4
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../../emails/emailHandlers.js";
import dotenv from "dotenv";
<<<<<<< HEAD
import cloudinary from "../lib/cloudinary.js";

dotenv.config();

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
=======
dotenv.config();  
import cloudinary from "../lib/cloudinary.js";

>>>>>>> f9bbb5fe930816781ce20dc29a171b16f673d5d4

  try {
    // ✅ Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    // ✅ Save and generate token
    const savedUser = await newUser.save();
    generateToken(savedUser._id, res);

    // ✅ Send success response
    res.status(201).json({
      _id: savedUser._id,
      email: savedUser.email,
      fullName: savedUser.fullName,
      profilePic: savedUser.profilePic,
    });

    // ✅ Send welcome email (non-blocking)
    try {
      await sendWelcomeEmail(savedUser.email, savedUser.fullName, process.env.CLIENT_URL);
      console.log("✅ Welcome email sent successfully to:", savedUser.email);
    } catch (error) {
      console.error("❌ Failed to send welcome email:", error.message);
    }

  } catch (error) {
    console.error("❌ Error in signup controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
<<<<<<< HEAD
=======
export const login = async(req,res)=>{
  const {email,password} = req.body;
  if(!email || !password){
    return res.status(400).json({message:"All fields are required"})
  }
  try {
    const user = await User.findOne({email})
    if(!user) return res.status(400).json({message:"Invalid Credentials"})
      const isPasswordCorrect = await bcrypt.compare(password,user.password)
    if(!isPasswordCorrect) return res.status(400).json({message:"Invalid Credentials"})
      generateToken(user._id,res)
    console.log("user logged in successfully");
    
    res.status(200).json({
      
      
      _id:user._id,
      fullName:user.fullName,
      email: user.email,
      profilePic:user.profilePic
    });
   ;
    
  } catch (error) {
    console.error("Error in login controller",error);
    res.status(500).json({message:"Internal Server error"})
    
  }
};
export const logout = async(_,res)=>{
  res.cookie("jwt","",{maxage:0})
  res.status(200).json({message:"Logged out successfully"});
};
export const updateProfile = async (req, res) => {
  
  try {
    const {profilePic} = req.body;
    if(!profilePic)
      return res.status(400).json({message:"Profile picture is required"})
    const userId = req.user._id;
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url})
  } catch (error) {
    
  }

}*/
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../../emails/emailHandlers.js";
import dotenv from "dotenv";
import cloudinary from "../lib/cloudinary.js";

dotenv.config();

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // ✅ Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    // ✅ Save and generate token
    const savedUser = await newUser.save();
    generateToken(savedUser._id, res);

    // ✅ Send success response
    res.status(201).json({
      _id: savedUser._id,
      email: savedUser.email,
      fullName: savedUser.fullName,
      profilePic: savedUser.profilePic,
    });

    // ✅ Send welcome email (non-blocking)
    try {
      await sendWelcomeEmail(savedUser.email, savedUser.fullName, process.env.CLIENT_URL);
      console.log("✅ Welcome email sent successfully to:", savedUser.email);
    } catch (error) {
      console.error("❌ Failed to send welcome email:", error.message);
    }

  } catch (error) {
    console.error("❌ Error in signup controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
>>>>>>> f9bbb5fe930816781ce20dc29a171b16f673d5d4

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });

  } catch (error) {
    console.error("❌ Error in login controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic)
      return res.status(400).json({ message: "Profile picture is required" });

    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser );

  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
