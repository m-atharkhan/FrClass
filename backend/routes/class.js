import express from "express";
import { createClass, getAllClasses, getClass, updateClass } from "../controllers/class.js";
import { authToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/create', authToken, createClass);
router.get('/get-class/:id', authToken, getClass);
router.get('/get-all-classes', authToken, getAllClasses);
router.put('/update/:id', authToken, updateClass);

export default router;