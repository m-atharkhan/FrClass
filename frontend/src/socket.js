import { io } from "socket.io-client";

const socket = io("https://loopin-backend.onrender.com", {
  autoConnect: false,
});

export default socket;