import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    try {
        const {username, password} = req.body;
        if (!username || !password) {
            return res.status(400).json({success:false, message:"All fields are required!"});
        }

        const user = await User.findOne({username});

        if (user) {
            return res.status(400).json({success:false, message:"Username already in use, please try another username."});
        }

        const newUser = new User({ username, password});
        await newUser.save();

        return res.status(201).json({success:true, message:"User created successfully.", User: newUser});

    } catch (error) {
        console.log(`Error in register user controller: ${error}`);
        return res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        if (!username || !password) {
            return res.status(400).json({success:false, message:"All fields are required!"});
        }

        const user = await User.findOne({username});

        if (!user) {
            return res.status(401).json({success:false, message:"Invalid username or password."});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid username or password." });
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1w'});
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ success: true, message: "Login successful." });

    } catch (error) {
        console.log(`Error in user login controller: ${error}`);
        return res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({ success: true, message: "User logged out successfully." });
    } catch (error) {
        console.log(`Error in user logout controller: ${error}`);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getProfile = (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({success:true, user});
    } catch (error) {
        console.log(`Error in user getProfile controller: ${error}`);
        return res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updateData = req.body;

        const restrictedFields = ["_id", "password", "createdAt", "updatedAt", "__v"];
        restrictedFields.forEach(field => delete updateData[field]);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({ success: true, user: updatedUser });

    } catch (error) {
        console.log(`Error in user updateProfile controller: ${error}`);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.status(200).json({success:true, user, message:"User profile deleted successfully!"});
    } catch (error) {
        console.log(`Error in user deleteProfile controller: ${error}`);
        return res.status(500).json({success:false, message:"Internal Server Error"});
    }
}