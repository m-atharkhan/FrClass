import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ClassPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [userClasses, setUserClasses] = useState([]);
    const [search, setSearch] = useState("");
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
                <h1 className="text-3xl font-bold text-center mb-4">All Classes</h1>
                {!user ? (
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-3 block w-20 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
                    >
                        Login
                    </button>
                ) : <button
                    onClick={() => navigate('/profile')}
                    className="mt-3 block w-20 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
                >
                    Profile
                </button>
                }
            </div>

            {/* 🔎 Search Bar */}
            <input
                type="text"
                placeholder="Search classes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md p-3 border border-gray-300 rounded-lg mb-6 block"
            />

            {/* 🚀 Only Logged-in Users Can Create Class */}
            {user && (
                <form onSubmit={handleCreateClass} className="max-w-lg bg-white p-6 rounded-xl shadow-md mb-6">
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
