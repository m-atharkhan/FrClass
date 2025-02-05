import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import socket from "../socket.js";
import { useAuth } from "./AuthContext.jsx";
import API from "../api/axios.js";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");
    const chatEndRef = useRef(null);
    const socketInitialized = useRef(false);
    const [classId, setClassId] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (classId) {
            fetchChatMessages(classId);
            if (!socketInitialized.current) {
                setupSocket(classId);
                socketInitialized.current = true;
            }
        }
    }, [classId, message]);

    const setupSocket = (classId) => {
        socket.connect();
        socket.emit("joinClass", classId);
        socket.on("receiveMessage", (newMessage) => {
            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        });
        return () => {
            socket.off("receiveMessage");
            socket.disconnect();
        };
    };

    const fetchChatMessages = async (classId) => {
        try {
            const res = await API.get(`/chat/${classId}`, {
                withCredentials: true,
            });
            setChatMessages(res.data.messages);
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        }
    };

    const sendMessage = async (id, message, selectedImage) => {
        if (!message.trim()) return;

        const formData = new FormData();
        formData.append("classId", id);
        formData.append("message", message);
        if (selectedImage) {
            formData.append("image", selectedImage);
        }

        try {
            await API.post("/chat/send", formData, { withCredentials: true });
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    return (
        <ChatContext.Provider value={{ chatMessages, message, setMessage, sendMessage, chatEndRef, setClassId, image, setImage }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
