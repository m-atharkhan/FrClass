import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const authToken = async (req, res, next) => {
    const token = req.cookies.jwt;
    if(!token) return res.status(403).json({success:false, message:"Unauthorized user."});
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        req.user = user;
        return next();
    } catch (error) { 
        return res.status(403).json({success:false, message:"Unauthorized user."});
    }
};