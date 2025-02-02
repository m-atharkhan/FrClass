import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from "http";
import { Server } from "socket.io";
import connectDB from './config/connectDB.js';
import userRoutes from './routes/user.js';
import classRoutes from './routes/class.js';
import pollRoutes from './routes/poll.js';
import chatRoutes from './routes/chat.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
app.use((req, res, next) => {
  req.io = io;
  next();
});


app.use('/api/user', userRoutes);
app.use('/api/class', classRoutes);
app.use('/api/poll', pollRoutes);
app.use('/api/chat', chatRoutes);

io.on("connection", (socket) => {
console.log("A user connected:", socket.id);

socket.on("joinClass", (classId) => {
  socket.join(classId);
  console.log(`User ${socket.id} joined class ${classId}`);
});

socket.on("disconnect", () => {
  console.log("A user disconnected:", socket.id);
});
});

server.listen(PORT, () => {
    console.log("App listening on PORT: " + PORT);
    connectDB();
});
