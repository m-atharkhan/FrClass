import React, { useState } from "react";
import { useChat } from "../../context/ChatContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import EmojiPicker from "emoji-picker-react";
import { FaCamera, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";

const ClassContent = ({ classDetails, id }) => {
    const { chatMessages, message, setMessage, sendMessage, image, setImage, chatEndRef } = useChat();
    const { user } = useAuth();
    const [imagePreview, setImagePreview] = useState(null);
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim() && !image) return;

        await sendMessage(id);
        setMessage("");
        setImagePreview(null);
        setImage(null);
    };

    const handleImagePreview = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setMessage((prev) => prev + emojiObject.emoji);
        setEmojiPickerVisible(false);
    };

    return (
        <div className="w-full md:w-3/4 p-4 flex flex-col bg-[#f0f2f5] min-h-screen">
            {/* Class Information */}
            {classDetails && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <h1 className="text-xl font-bold text-green-700 cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
                        {classDetails.name}
                    </h1>
                    <p className="text-gray-600">{classDetails.description}</p>
                    {showDetails && (
                        <div className="mt-3 text-gray-600">
                            <h3 className="font-semibold">Students:</h3>
                            <ul>{classDetails.students.map((student, i) => <li key={i}>{student.username}</li>)}</ul>

                            <h3 className="mt-3 font-semibold">Polls:</h3>
                            {classDetails.polls.length ? (
                                <ul>{classDetails.polls.map((poll, i) => <li key={i}>{poll.question}</li>)}</ul>
                            ) : (
                                <p className="text-gray-500">No polls available.</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Chat Section */}
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md p-4 relative">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto max-h-[65vh] p-2">
                    {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender._id === user._id ? "justify-end" : "justify-start"} mb-2`}>
                            <div className={`p-2 rounded-2xl shadow-md text-sm max-w-xs ${msg.sender._id === user._id
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-black"
                                }`}
                            >
                                <div className="text-xs text-gray-300">{msg.sender._id === user._id ? "Me" : msg.sender.username}</div>
                                <p className="mt-1">{msg.message}</p>
                                {msg.image && (
                                    <img src={msg.image} alt="Attachment" className="mt-2 w-40 h-auto rounded-lg" />
                                )}
                                <span className="text-xs text-gray-300 block mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef}></div>
                </div>

                {/* Chat Input */}
                <div className="fixed bottom-0 left-0 w-full md:w-3/4 bg-white p-2 border-t flex items-center shadow-lg z-50">
                    {/* Emoji Picker Button */}
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

                    {/* Input Field */}
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Type a message"
                        className="flex-1 p-3 rounded-full bg-gray-100 border border-gray-300 focus:outline-none text-gray-800 mx-2"
                    />

                    {/* Image Upload Button */}
                    <input type="file" accept="image/*" onChange={handleImagePreview} className="hidden" id="imageUpload" />
                    <label htmlFor="imageUpload" className="cursor-pointer text-gray-500 text-2xl p-2 hover:text-green-500 transition">
                        <FaCamera />
                    </label>

                    {/* Send or Microphone Button */}
                    {message || imagePreview ? (
                        <button onClick={handleSendMessage} className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition ml-2">
                            <FaPaperPlane />
                        </button>
                    ) : (
                        <button className="text-gray-500 text-2xl p-2 hover:text-green-500 transition">
                            <FaMicrophone />
                        </button>
                    )}

                    {/* Image Preview Box */}
                    {imagePreview && (
                        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-md w-40 z-50">
                            <img src={imagePreview} alt="Preview" className="w-full h-auto object-cover rounded-lg border border-gray-300" />
                            <button className="text-red-500 text-xl ml-4" onClick={() => setImagePreview(null)}>
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
