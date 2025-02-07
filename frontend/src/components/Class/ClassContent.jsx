import React, { useState } from "react";
import { useChat } from "../../context/ChatContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { FaCamera } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { FaCamera, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs"; // WhatsApp-like emoji icon

const ClassContent = ({ classDetails, id }) => {
    const { chatMessages, message, setMessage, sendMessage, image, setImage, chatEndRef } = useChat();
    const { user } = useAuth();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const handleClassClick = () => {
        setShowDetails(!showDetails);
    };

    const handleSendMessage = async () => {
        if (!message.trim() && !image) return;

        await sendMessage(id);
        setMessage("");
        setSelectedImage(null);
        setImagePreview(null);
        setImage(null);
    };

    const handleImagePreview = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result); // Base64 for preview
                setSelectedImage(reader.result);
                setImage(reader.result); // Base64 for sending
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setMessage((prev) => prev + emojiObject.emoji);
        setEmojiPickerVisible(false);
    };

    return (
        <div className="w-3/4 p-6 flex flex-col">
            {/* Class Information */}
            {classDetails ? (
                <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <h1 className="text-2xl font-bold text-green-700 cursor-pointer" onClick={handleClassClick}>
                        {classDetails.name}
                    </h1>
                    <p className="mt-2 text-gray-600">{classDetails.description}</p>
                    {showDetails && (
                        <div className="mt-4">
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold">Students:</h3>
                                <ul>
                                    {classDetails.students.map((student, index) => (
                                        <li key={index} className="text-gray-600">{student.username}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Polls:</h3>
                                {classDetails.polls.length > 0 ? (
                                    <ul>
                                        {classDetails.polls.map((poll, index) => (
                                            <li key={index} className="text-gray-600">{poll.question}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No polls available.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-gray-500 text-center">Loading class details...</p>
            )}

            {/* Chat Section */}
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg p-4">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto max-h-[65vh] p-2">
                    {chatMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender._id === user._id ? "justify-start" : "justify-end"} mb-2`}>
                            <div className={`p-2 rounded-lg shadow ${msg.sender._id === user._id
                                ? "bg-green-500 text-white text-left"
                                : "bg-green-100 text-black text-left"} max-w-xs`}
                            >
                                <div className="text-xs block mt-1 text-green-800">{msg.sender._id === user._id ? "Me" : msg.sender.username}</div>
                                <p className="text-sm">{msg.message}</p>
                                {msg.image && (
                                    <img src={msg.image} alt="Message attachment" className="mt-2 object-cover rounded-lg" />
                                )}
                                <span className="text-xs block mt-1 text-gray-500">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef}></div>
                </div>

                {/* Chat Input */}

                <div className="fixed bottom-0 left-0 w-full bg-white p-2 border-t shadow-lg flex items-center z-50">
                    {/* Emoji Picker Button (WhatsApp-style) */}
                    <button
                        className="text-gray-500 text-2xl p-2 hover:text-green-500 transition"
                        onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
                    >
                        <BsEmojiSmile />
                    </button>

                    {/* Emoji Picker Dropdown */}
                    {emojiPickerVisible && (
                        <div className="absolute bottom-16 left-2 bg-white p-2 rounded-lg shadow-lg z-50">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}

                    {/* Input Field (WhatsApp Style) */}
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSendMessage();
                            }
                        }}
                        placeholder="Type a message"
                        className="flex-1 p-3 rounded-full border focus:outline-none bg-gray-100 text-gray-800 mx-2"
                    />

                    {/* Image Upload Button (WhatsApp-style Camera Icon) */}
                    <input type="file" accept="image/*" onChange={handleImagePreview} className="hidden" id="imageUpload" />
                    <label htmlFor="imageUpload" className="cursor-pointer text-gray-500 text-2xl p-2 hover:text-green-500 transition">
                        <FaCamera />
                    </label>

                    {/* Send or Microphone Button (WhatsApp-style Logic) */}
                    {message || imagePreview ? (
                        <button
                            onClick={handleSendMessage}
                            className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition ml-2"
                        >
                            <FaPaperPlane />
                        </button>
                    ) : (
                        <button className="text-gray-500 text-2xl p-2 hover:text-green-500 transition">
                            <FaMicrophone />
                        </button>
                    )}

                    {/* Image Preview Floating Box (WhatsApp-style) */}
                    {imagePreview && (
                        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-md w-40 z-50">
                            <img src={imagePreview} alt="Preview" className="w-full h-auto object-cover rounded-lg border border-gray-300" />
                            <button
                                className="text-red-500 text-xl ml-4"
                                onClick={() => {
                                    setSelectedImage(null);
                                    setImagePreview(null);
                                }}
                            >
                                ✖
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ClassContent;
