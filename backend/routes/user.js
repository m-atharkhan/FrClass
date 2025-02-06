import express from "express";
import { deleteProfile, getProfile, login, logout, register, updateProfile } from "../controllers/user.js";
import { authToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', authToken, logout);

router.get('/profile', authToken, getProfile);
router.put('/update-profile', authToken, updateProfile);
router.delete('/delete-profile', authToken, deleteProfile);


export default router;