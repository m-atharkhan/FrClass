import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import userRoutes from './routes/user.js';
import classRoutes from './routes/class.js';
import pollRoutes from './routes/poll.js';
import chatRoutes from './routes/chat.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/class', classRoutes);
app.use('/api/poll', pollRoutes);
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => {
    console.log("App listening on PORT: " + PORT);
    connectDB();
});
