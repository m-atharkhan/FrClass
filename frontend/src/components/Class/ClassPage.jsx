import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaRegPenToSquare } from "react-icons/fa6";
import axios from "axios";

const ClassPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [userClasses, setUserClasses] = useState([]);
    const [search, setSearch] = useState("");
    const [createVisible, setCreateVisible] = useState(false);
    const [newClass, setNewClass] = useState({ name: "", description: "" });

    useEffect(() => {
        fetchClasses();
        if (user) {
            fetchUserSubscribedClasses();
        }
    }, [user]);

    const fetchClasses = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/class/get-all-classes");
            setClasses(res.data.class);
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    };

    const fetchUserSubscribedClasses = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/class/subscribe", {
                withCredentials: true,
            });
            setUserClasses(res.data.classes.map(cls => cls._id));
        } catch (error) {
            console.error("Error fetching subscribed classes:", error);
        }
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        if (!newClass.name || !newClass.description) {
            return alert("All fields are required!");
        }
        try {
            await axios.post(
                "http://localhost:5000/api/class/create",
                newClass,
                { withCredentials: true }
            );
            alert("Class created successfully!");
            fetchClasses();
            setNewClass({ name: "", description: "" });
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create class.");
        }
    };

    const handleJoinClass = async (classId) => {
        try {
            await axios.post(`http://localhost:5000/api/class/subscribe/${classId}`, {}, { withCredentials: true });
            alert("You have joined the class!");
            fetchUserSubscribedClasses();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to join class.");
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <div className="flex items-center justify-between mb-8">
                <div className="w-full flex justify-between">
                    <div className="flex items-center gap-10">
                        <img
                            src="https://files.oaiusercontent.com/file-F8AHPrJcnYhCQn6N8rRFuo?se=2025-02-05T19%3A48%3A31Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D01eebba6-6295-4f7a-8d99-8e3ef6de52a2.webp&sig=FWne202%2BKWN8LlRGxN29TcMMPDR5ejBZ%2BKcHtUlwuS8%3D"
                            className="w-16 h-16 mx-auto rounded-full border-2 cursor-pointer border-blue-400"
                        />
                        <h1 className="text-3xl italic font-bold text-center mb-4">Connect & Share</h1>
                    </div>
                    <div>
                        {!user ? (
                            <button
                                onClick={() => navigate('/login')}
                                className="mt-3 block w-20 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
                            >
                                Login
                            </button>
                        ) : <img
                            src="https://th.bing.com/th/id/OIP.ln3Rd8nn4BPJY7i5g9WWmAHaG6?rs=1&pid=ImgDetMain"
                            onClick={() => navigate('/profile')}
                            className="w-16 h-16 mx-auto rounded-full border-2 cursor-pointer border-blue-400"
                        />
                        }
                    </div>
                </div>
            </div>

            {/* 🔎 Search Bar */}
            <div className="flex items-center gap-8">
                <input
                    type="text"
                    placeholder="Search classes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md p-3 rounded-3xl text-green-600 border-2 active:border-green-600 border-green-600 mb-6 block"
                />

                {/* 🚀 Only Logged-in Users Can Create Class */}
                {user && (<div
                    className="flex gap-2 items-center text-xl font-semibold mb-4 text-green-600 cursor-pointer"
                    onClick={() => setCreateVisible(!createVisible)}>
                    <span className="font-bold italic p-2 rounded-2xl bg-green-200">Create Class</span>
                    <FaRegPenToSquare className="text-4xl text-black" />
                </div>)}
            </div>
            {user && (
                <form onSubmit={handleCreateClass} className={`max-w-3xl ${createVisible ? "block" : "hidden"} bg-white p-6 rounded-xl shadow-md mb-6`}>
                    <h2 className="text-xl font-semibold mb-4">Create a New Class</h2>
                    <input
                        type="text"
                        placeholder="Class Name"
                        value={newClass.name}
                        onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-3"
                        required
                    />
                    <textarea
                        placeholder="Class Description"
                        value={newClass.description}
                        onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-3"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
                    >
                        Create Class
                    </button>
                </form>
            )}

            {/* 📌 Display Classes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes
                    .filter((cls) => cls.name.toLowerCase().includes(search.toLowerCase()))
                    .map((cls) => (
                        <div key={cls._id} className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                            <h2 className="text-xl font-bold">{cls.name}</h2>
                            <p className="text-gray-700 mt-2">{cls.description}</p>

                            {user && userClasses.includes(cls._id) ? (
                                <button
                                    onClick={() => navigate(`/class/${cls._id}`)}
                                    className="mt-3 block w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                                >
                                    View Class
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleJoinClass(cls._id)}
                                    className="mt-3 block w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
                                >
                                    Join Class
                                </button>
                            )}
                        </div>
                    ))}
            </div>

        </div>
    );
};

export default ClassPage;
