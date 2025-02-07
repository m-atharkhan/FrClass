import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClassContent from "./ClassContent.jsx";
import { useChat } from "../../context/ChatContext.jsx";
import { FaHome, FaBars, FaTimes } from "react-icons/fa"; // Icons for menu
import API from "../../api/axios.js";

const ClassDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setClassId } = useChat();
    const [classDetails, setClassDetails] = useState(null);
    const [classes, setClasses] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        fetchUserSubscribedClasses();
    }, []);

    useEffect(() => {
        if (id) {
            fetchClassDetails(id);
            setClassId(id);
        } else if (classes.length > 0) {
            navigate(`/class/${classes[0]._id}`);
        }
    }, [id, classes, navigate, setClassId]);

    const fetchUserSubscribedClasses = async () => {
        try {
            const res = await API.get("/class/subscribe", {
                withCredentials: true,
            });
            setClasses(res.data.classes);
        } catch (error) {
            console.error("Error fetching subscribed classes:", error);
        }
    };

    const fetchClassDetails = async (classId) => {
        try {
            const res = await API.get(`/class/get-class/${classId}`, {
                withCredentials: true,
            });
            setClassDetails(res.data.class);
        } catch (error) {
            console.error("Error fetching class details:", error);
        }
    };

    return (
        <div className="flex h-screen overflow-y-clip relative">
            {/* Hamburger Menu Button (Mobile) */}
            <button
                className="absolute top-4 right-4 z-50 md:hidden text-white bg-transparent text-2xl"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Sidebar - Hidden on Mobile */}
            <div className={`fixed top-0 right-0 h-full w-64 bg-gray-200 p-4 border-l shadow-lg transform ${menuOpen ? "translate-x-0" : "translate-x-full"} transition-transform md:relative md:translate-x-0 md:w-1/4 md:border-r md:shadow-none`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Subscribed Classes</h2>
                    <FaHome
                        onClick={() => navigate("/")}
                        className="cursor-pointer text-2xl text-gray-700 hover:text-green-500"
                    />
                </div>
                {classes.map((cls) => (
                    <div
                        key={cls._id}
                        onClick={() => {
                            navigate(`/class/${cls._id}`);
                            setMenuOpen(false);
                        }}
                        className={`p-3 rounded-lg cursor-pointer mb-2 hover:bg-green-400 transition ${id === cls._id ? "bg-green-600 text-white" : "bg-white"}`}
                    >
                        {cls.name}
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <ClassContent classDetails={classDetails} id={id} />
        </div>
    );
};

export default ClassDetailsPage;
