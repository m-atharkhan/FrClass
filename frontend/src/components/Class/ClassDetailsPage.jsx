import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../../socket.js"; // Import the socket utility
import { useAuth } from "../../context/AuthContext.jsx";

const ClassDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [classDetails, setClassDetails] = useState(null);
    const [classes, setClasses] = useState([]);
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [userId, setUserId] = useState(null); // Store logged-in user ID
    const chatEndRef = useRef(null);
    const socketInitialized = useRef(false); // Prevent multiple socket listeners

    useEffect(() => {
        fetchUserSubscribedClasses();
    }, []);

    useEffect(() => {
        if (id) {
            fetchClassDetails(id);
            fetchChatMessages(id);
            if (!socketInitialized.current) {
                setupSocket();
                socketInitialized.current = true;
            }
        } else if (classes.length > 0) {
            navigate(`/class/${classes[0]._id}`);
        }
    }, [id, classes, message]);

    // Set up WebSocket connection
    const setupSocket = () => {
        socket.connect();
        socket.emit("joinClass", id);
        socket.on("receiveMessage", (newMessage) => {
            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off("receiveMessage"); // Remove event listener to prevent duplicates
            socket.disconnect();
        };
    };

    // Fetch user-subscribed classes
    const fetchUserSubscribedClasses = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/class/subscribe", {
                withCredentials: true,
            });
            setClasses(res.data.classes);
        } catch (error) {
            console.error("Error fetching subscribed classes:", error);
        }
    };

    // Fetch class details
    const fetchClassDetails = async (classId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/class/get-class/${classId}`, {
                withCredentials: true,
            });
            setClassDetails(res.data.class);
        } catch (error) {
            console.error("Error fetching class details:", error);
        }
    };

    // Fetch chat messages
    const fetchChatMessages = async (classId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/chat/${classId}`, {
                withCredentials: true,
            });
            setChatMessages(res.data.messages);

        } catch (error) {
            console.error("Error fetching chat messages:", error);
        }
    };

    // Send a new message
    const sendMessage = async () => {
        if (!message.trim()) return;

        try {
            await axios.post(
                "http://localhost:5000/api/chat/send",
                { classId: id, message },
                { withCredentials: true }
            );

            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Scroll to the latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    return (
        <div className="flex h-screen">
            {/* Left Sidebar - Subscribed Classes */}
            <div className="w-1/4 relative bg-gray-200 p-4 border-r overflow-y-auto">
                <h2 className="text-lg font-bold mb-4">Subscribed Classes</h2>
                {classes.map((cls) => (
                    <div
                        key={cls._id}
                        onClick={() => navigate(`/class/${cls._id}`)}
                        className={`p-3 rounded-lg cursor-pointer mb-2 hover:bg-green-400 transition ${id === cls._id ? "bg-green-600 text-white" : "bg-white"
                            }`}
                    >
                        {cls.name}
                    </div>
                ))}
                <button
                    onClick={() => navigate("/")}
                    className="w-3/4 absolute bg-green-600 bottom-0 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
                >
                    Home
                </button>
            </div>

            {/* Right Section - Class Details and Chat */}
            <div className="w-3/4 p-6 flex flex-col">
                {/* Class Details */}
                {classDetails ? (
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                        <h1 className="text-2xl font-bold text-green-700">{classDetails.name}</h1>
                        <p className="mt-2 text-gray-600">{classDetails.description}</p>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">Loading class details...</p>
                )}

                {/* Chat Box */}
                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg p-4">
                    <div className="flex-1 overflow-y-auto max-h-[65vh] p-2">
                        {chatMessages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender._id === user._id ? "justify-start" : "justify-end"
                                    } mb-2`}
                            >
                                {/* {console.log(msg.sender._id, user._id)} */}
                                <div
                                    className={`p-2 rounded-lg shadow ${msg.sender._id === user._id
                                        ? "bg-green-500 text-white text-left"
                                        : "bg-green-100 text-black text-left"
                                        } max-w-xs`}
                                >
                                    {
                                        msg.sender._id === user._id ? (
                                            <>

                                                <div className="text-xs block mt-1 text-green-800">Me</div>
                                                <p className="text-sm">{msg.message}</p>
                                                <span className="text-xs block mt-1 text-white-200">
                                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-xs block mt-1 text-green-800">{msg.sender.username}</div>
                                                <p className="text-sm">{msg.message}</p>
                                                <span className="text-xs block mt-1 text-green-500">
                                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                                </span>
                                            </>
                                        )
                                    }

                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef}></div>
                    </div>

                    {/* Message Input Box */}
                    <div className="flex p-2 border-t">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 p-2 border rounded-l-lg focus:outline-none"
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-green-600 text-white px-4 rounded-r-lg hover:bg-green-700 transition duration-300"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailsPage;
