import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/auth.model.js";
import bcryptjs from "bcryptjs";

export const Signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ Message: "All field required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status().json({ message: "user email exist" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const NewUser = new User({
      fullName: fullName,
      email: email,
      password: hashPassword,
    });

    if (NewUser) {
      generateToken(NewUser._id, res);
      await NewUser.save();
      return res
        .status(201)
        .json({ message: "user created successfully", NewUser });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server" });
  }
};

export const Signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "invalid credencials" });
    }

    const isPassword = await bcryptjs.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    generateToken(user._id, res);

    res.status(200).json({ message: "login successfully", user });
  } catch (error) {
    console.log("error in login", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profile } = req.body;
    const usreId = req.user._id;

    if (!profile) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadresponse = await cloudinary.uploader.upload(profile);
    const updatedUser = await User.findByIdAndUpdate(
      usreId,
      { profile: uploadresponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error to upload prfile");
    res.status(500).json({ message: "internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
    // console.log(req.user);
  } catch (error) {
    console.log("error in check auth controller", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
};
