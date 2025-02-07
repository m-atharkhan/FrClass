import React, { useState } from "react";
import { useChat } from "../../context/ChatContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { FaCamera, FaPaperPlane } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

const ClassContent = ({ classDetails, id }) => {
    const { chatMessages, message, setMessage, sendMessage, image, setImage, chatEndRef } = useChat();
    const { user } = useAuth();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

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
                setImagePreview(reader.result);
                setSelectedImage(reader.result);
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
        <div className="flex flex-col w-full h-screen bg-gray-100">
            {/* Class Details (Full Width on Mobile) */}
            {classDetails && (
                <div className="p-4 bg-white shadow-md">
                    <h1 className="text-xl font-bold text-green-700">{classDetails.name}</h1>
                    <p className="text-gray-600">{classDetails.description}</p>
                </div>
            )}

            {/* Chat Section */}
            <div className="flex flex-col flex-grow bg-white shadow-md">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-3">
                    {chatMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender._id === user._id ? "justify-start" : "justify-end"} mb-2`}>
                            <div className={`p-2 rounded-lg shadow-lg ${msg.sender._id === user._id
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-black"} max-w-xs`}
                            >
                                <p className="text-sm">{msg.message}</p>
                                {msg.image && <img src={msg.image} alt="Message" className="mt-2 rounded-lg w-32" />}
                                <span className="text-xs block mt-1 text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef}></div>
                </div>

                {/* Chat Input - Styled Like WhatsApp */}
                <div className="flex items-center bg-white p-2 border-t shadow-lg relative">
                    {/* Emoji Picker */}
                    {emojiPickerVisible && (
                        <div className="absolute bottom-16 left-2 shadow-lg z-50 bg-white rounded-lg p-2">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}

                    {/* Emoji Button */}
                    <button
                        className="text-gray-500 text-2xl p-2 hover:text-green-500 transition"
                        onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
                    >
                        <BsEmojiSmile />
                    </button>

                    {/* Input Field */}
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSendMessage();
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 p-3 rounded-full border focus:outline-none text-gray-800"
                    />

                    {/* Image Upload */}
                    <input type="file" accept="image/*" onChange={handleImagePreview} className="hidden" id="imageUpload" />
                    <label htmlFor="imageUpload" className="cursor-pointer text-gray-500 text-2xl p-2 hover:text-green-500 transition">
                        <FaCamera />
                    </label>

                    {/* Send Button */}
                    <button
                        onClick={handleSendMessage}
                        className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition"
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </div>

            {/* Image Preview Floating Box (Like WhatsApp) */}
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
                        <IoMdClose />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClassContent;
