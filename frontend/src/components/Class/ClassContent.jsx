import React, { useState } from "react";
import { useChat } from "../../context/ChatContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { FaCamera } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

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
        <div className="flex flex-col lg:flex-row w-full h-full p-4 gap-4">
            {/* Class Information (Takes full width on mobile) */}
            {classDetails ? (
                <div className="bg-white p-6 rounded-lg shadow-lg w-full lg:w-2/3">
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

            {/* Chat Section (Stacks below class description on mobile) */}
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg p-4 w-full lg:w-1/3">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto max-h-[50vh] lg:max-h-[65vh] p-2">
                    {chatMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender._id === user._id ? "justify-start" : "justify-end"} mb-2`}>
                            <div className={`p-2 rounded-lg shadow ${msg.sender._id === user._id
                                ? "bg-green-500 text-white text-left"
                                : "bg-green-100 text-black text-left"} max-w-xs`}
                            >
                                <div className="text-xs block mt-1 text-green-800">{msg.sender._id === user._id ? "Me" : msg.sender.username}</div>
                                <p className="text-sm">{msg.message}</p>
                                {msg.image && (
                                    <img src={msg.image} alt="Message attachment" className="mt-2 object-cover rounded-lg w-32" />
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
                <div className="flex relative p-2 border-t">
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
                        className="flex-1 p-2 border rounded-l-lg focus:outline-none"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-green-600 text-white px-4 cursor-pointer rounded-r-lg hover:bg-green-700 transition duration-300"
                    >
                        Send
                    </button>

                    {/* Image Upload */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImagePreview}
                        className="hidden"
                        id="imageUpload"
                    />
                    <label htmlFor="imageUpload">
                        <FaCamera className="text-2xl my-2 cursor-pointer ml-2" />
                    </label>

                    {/* Emoji Picker */}
                    <button
                        className="text-2xl cursor-pointer ml-2"
                        onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
                    >
                        😀
                    </button>

                    {emojiPickerVisible && (
                        <div className="absolute bottom-16">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}

                    {/* Preview Selected Image */}
                    {imagePreview && (
                        <div className="absolute bottom-20 bg-gray-100 p-4 rounded-lg shadow-md w-40">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-auto object-cover rounded-lg border border-gray-300"
                            />
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
