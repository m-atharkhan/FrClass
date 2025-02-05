import express from 'express';
import { sendMessage, getMessages } from '../controllers/chat.js';
import { authToken } from '../middleware/verifyToken.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

router.post('/send', authToken, upload.single('image'), sendMessage);
router.get('/:classId', authToken, getMessages);

export default router;
