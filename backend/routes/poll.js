import express from "express";
import { authToken } from "../middleware/verifyToken.js";
import { createPoll, deletePoll, getAllPolls, getPoll, votePoll } from "../controllers/poll.js";

const router = express.Router();

router.post('/create', authToken, createPoll);
router.get('/get-poll/:id', authToken, getPoll);
router.delete('/delete-poll/:id', authToken, deletePoll);
router.get('/get-all-poll/:classId', authToken, getAllPolls);

router.post('/:id/vote', authToken, votePoll);
router.post('/:id/result', authToken, votePoll);

export default router;