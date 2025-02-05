import React, { useState } from "react";
import { useChat } from "../../context/ChatContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { FaCamera, FaImage, FaSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

const ClassContent = ({ classDetails, id }) => {
    const { chatMessages, message, setMessage, sendMessage, chatEndRef } = useChat();
    const { user } = useAuth();
    const [selectedImage, setSelectedImage] = useState(null);
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const handleClassClick = () => {
        setShowDetails(!showDetails);
    };

    const handleSendMessage = () => {
        sendMessage(id, message, selectedImage);
        setSelectedImage(null);
    };

    const handleImagePreview = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleEmojiClick = (emojiObject) => {
        setMessage(message + emojiObject.emoji);
        setEmojiPickerVisible(false);
    };

    return (
        <div className="w-3/4 p-6 flex flex-col">
            {/* Class Information */}
            {classDetails ? (
                <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                    <h1 className="text-2xl font-bold text-green-700 cursor-pointer" onClick={handleClassClick}>{classDetails.name}</h1>
                    <p className="mt-2 text-gray-600">{classDetails.description}</p>
                    {showDetails && (
                        <div className="mt-4">
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold">Students:</h3>
                                <ul>
                                    {classDetails.students.map((student, index) => (
                                        <li key={index} className="text-gray-600">
                                            {student.username}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold">Polls:</h3>
                                {classDetails.polls.length > 0 ? (
                                    <ul>
                                        {classDetails.polls.map((poll, index) => (
                                            <li key={index} className="text-gray-600">
                                                {poll.question}
                                            </li>
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
                        <div
                            key={index}
                            className={`flex ${msg.sender._id === user._id ? "justify-start" : "justify-end"} mb-2`}
                        >
                            <div
                                className={`p-2 rounded-lg shadow ${msg.sender._id === user._id
                                    ? "bg-green-500 text-white text-left"
                                    : "bg-green-100 text-black text-left"} max-w-xs`}
                            >
                                {msg.sender._id === user._id ? (
                                    <>
                                        <div className="text-xs block mt-1 text-green-800">Me</div>
                                        <p className="text-sm">{msg.message}</p>
                                        {msg.image && (
                                            <img src={msg.image} alt="Message attachment" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                                        )}
                                        <span className="text-xs block mt-1 text-white-200">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-xs block mt-1 text-green-800">{msg.sender.username}</div>
                                        <p className="text-sm">{msg.message}</p>
                                        {msg.image && (
                                            <img src={msg.image} alt="Message attachment" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                                        )}
                                        <span className="text-xs block mt-1 text-green-500">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                    </>
                                )}
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
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border rounded-l-lg focus:outline-none"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-green-600 text-white px-4 cursor-pointer rounded-r-lg hover:bg-green-700 transition duration-300"
                    >
                        Send
                    </button>

                    {/* Image Upload Button */}
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
                    <div className="ml-2">
                        <button
                            className="text-2xl cursor-pointer"
                            onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
                        >
                            😀
                        </button>
                    </div>

                    {/* Emoji Picker */}
                    {emojiPickerVisible && (
                        <div className="absolute bottom-16">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}

                    {/* Preview Selected Image */}
                    {selectedImage && (
                        <div className="mt-2 absolute -top-56 flex justify-center items-center bg-gray-100 p-4 rounded-lg shadow-md">
                            <div className="flex flex-col items-center">
                                <img
                                    src={URL.createObjectURL(selectedImage)}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                                />
                                <p className="text-sm text-gray-700 mt-2">{selectedImage.name}</p>
                            </div>
                            {/* Close button to remove the image preview */}
                            <button
                                className="text-red-500 text-xl ml-4"
                                onClick={() => setSelectedImage(null)}
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
