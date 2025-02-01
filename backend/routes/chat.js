import express from 'express';
import { sendMessage, getMessages } from '../controllers/chat.js';
import { authToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/send', authToken, sendMessage);
router.get('/:classId', authToken, getMessages);

export default router;
