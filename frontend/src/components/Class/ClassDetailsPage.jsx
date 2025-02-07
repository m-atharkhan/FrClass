import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ClassContent from "./ClassContent.jsx";
import { useChat } from "../../context/ChatContext.jsx";
import { FaHome, FaBars } from "react-icons/fa";
import API from "../../api/axios.js";

const ClassDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setClassId } = useChat();
    const [classDetails, setClassDetails] = useState(null);
    const [classes, setClasses] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [sidebarVisible, setSidebarVisible] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
        <div className="flex h-screen overflow-y-clip">
            {/* Sidebar (Hidden on Mobile) */}
            {!isMobile && (
                <div className="w-1/4 bg-gray-200 p-4 border-r overflow-y-auto">
                    <div className="flex justify-between">
                        <h2 className="text-lg font-bold mb-4">Subscribed Classes</h2>
                        <FaHome
                            onClick={() => navigate("/")}
                            className="cursor-pointer text-2xl"
                        />
                    </div>
                    {classes.map((cls) => (
                        <div
                            key={cls._id}
                            onClick={() => navigate(`/class/${cls._id}`)}
                            className={`p-3 rounded-lg cursor-pointer mb-2 hover:bg-green-400 transition ${id === cls._id ? "bg-green-600 text-white" : "bg-white"}`}
                        >
                            {cls.name}
                        </div>
                    ))}
                </div>
            )}

            {/* Mobile Toggle Button */}
            {isMobile && (
                <button
                    className="fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-full"
                    onClick={() => setSidebarVisible(!sidebarVisible)}
                >
                    <FaBars className="text-xl" />
                </button>
            )}

            {/* Mobile Sidebar */}
            {isMobile && sidebarVisible && (
                <div className="absolute top-0 left-0 w-3/4 h-full bg-gray-200 p-4 shadow-lg">
                    <div className="flex justify-between">
                        <h2 className="text-lg font-bold mb-4">Subscribed Classes</h2>
                        <FaHome
                            onClick={() => navigate("/")}
                            className="cursor-pointer text-2xl"
                        />
                    </div>
                    {classes.map((cls) => (
                        <div
                            key={cls._id}
                            onClick={() => {
                                navigate(`/class/${cls._id}`);
                                setSidebarVisible(false);
                            }}
                            className={`p-3 rounded-lg cursor-pointer mb-2 hover:bg-green-400 transition ${id === cls._id ? "bg-green-600 text-white" : "bg-white"}`}
                        >
                            {cls.name}
                        </div>
                    ))}
                </div>
            )}

            {/* Show Class Content Only on Mobile */}
            {isMobile && <ClassContent classDetails={classDetails} id={id} />}
        </div>
    );
};

export default ClassDetailsPage;
