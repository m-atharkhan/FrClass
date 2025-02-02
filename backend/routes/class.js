import express from "express";
import { createClass, getAllClasses, getClass, getSubscribedClass, subscribeClass, updateClass } from "../controllers/class.js";
import { authToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/create', authToken, createClass);
router.get('/get-class/:id', getClass);
router.get('/get-all-classes', getAllClasses);
router.put('/update/:id', authToken, updateClass);

router.post('/subscribe/:id', authToken, subscribeClass);
router.get('/subscribe', authToken, getSubscribedClass);
export default router;