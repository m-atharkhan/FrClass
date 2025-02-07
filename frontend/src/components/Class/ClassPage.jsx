import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaRegPenToSquare } from "react-icons/fa6";
import { FiMenu, FiX } from "react-icons/fi";
import axios from "axios";
import API from "../../api/axios";

const ClassPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [userClasses, setUserClasses] = useState([]);
    const [search, setSearch] = useState("");
    const [createVisible, setCreateVisible] = useState(false);
    const [newClass, setNewClass] = useState({ name: "", description: "" });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        fetchClasses();
        if (user) {
            fetchUserSubscribedClasses();
        }
    }, [user]);

    const fetchClasses = async () => {
        try {
            const res = await API.get("/class/get-all-classes");
            setClasses(res.data.class);
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    };

    const fetchUserSubscribedClasses = async () => {
        try {
            const res = await API.get("/class/subscribe", { withCredentials: true });
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
            await API.post("/class/create", newClass, { withCredentials: true });
            alert("Class created successfully!");
            fetchClasses();
            setNewClass({ name: "", description: "" });
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create class.");
        }
    };

    const handleJoinClass = async (classId) => {
        try {
            await API.post(`/class/subscribe/${classId}`, {}, { withCredentials: true });
            alert("You have joined the class!");
            fetchUserSubscribedClasses();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to join class.");
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <img
                        src="https://res.cloudinary.com/ddli8bywu/image/upload/v1738833010/DALL_E_2025-02-06_01.16.14_-_A_close-up_digital_illustration_of_two_hands_clasping_each_other_in_a_gesture_of_connection_and_support_similar_to_the_classic_Nokia_handshake_logo._bv1wok.webp"
                        className="w-14 h-14 rounded-full border-2 cursor-pointer border-blue-400"
                        alt="Logo"
                    />
                    <h1 className="text-3xl italic font-bold text-center">Loop IN</h1>
                </div>

                {/* Mobile Menu Icon */}
                <div className="md:hidden">
                    {mobileMenuOpen ? (
                        <FiX className="text-3xl cursor-pointer" onClick={() => setMobileMenuOpen(false)} />
                    ) : (
                        <FiMenu className="text-3xl cursor-pointer" onClick={() => setMobileMenuOpen(true)} />
                    )}
                </div>

                {/* Profile or Login Button (Desktop) */}
                <div className="hidden md:block">
                    {!user ? (
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
                        >
                            Login
                        </button>
                    ) : (
                        <img
                            src={user.profilePic}
                            onClick={() => navigate('/profile')}
                            className="w-14 h-14 rounded-full border-2 cursor-pointer border-blue-400"
                            alt="User Profile"
                        />
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden flex flex-col items-center bg-white shadow-md py-4 rounded-lg">
                    {!user ? (
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300 mb-2"
                        >
                            Login
                        </button>
                    ) : (
                        <img
                            src={user.profilePic}
                            onClick={() => navigate('/profile')}
                            className="w-14 h-14 rounded-full border-2 cursor-pointer border-blue-400"
                            alt="User Profile"
                        />
                    )}
                </div>
            )}

            {/* Search & Create Class */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <input
                    type="text"
                    placeholder="Search classes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md p-3 rounded-3xl border-2 border-green-600 focus:border-green-700"
                />
                {user && (
                    <div
                        className="flex gap-2 items-center text-xl font-semibold text-green-600 cursor-pointer"
                        onClick={() => setCreateVisible(!createVisible)}
                    >
                        <span className="font-bold italic p-2 rounded-2xl bg-green-200">Create Class</span>
                        <FaRegPenToSquare className="text-4xl text-black" />
                    </div>
                )}
            </div>

            {/* Create Class Form */}
            {user && createVisible && (
                <form onSubmit={handleCreateClass} className="max-w-3xl bg-white p-6 rounded-xl shadow-md mt-4">
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

            {/* Display Classes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {classes.filter((cls) => cls.name.toLowerCase().includes(search.toLowerCase())).map((cls) => (
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
