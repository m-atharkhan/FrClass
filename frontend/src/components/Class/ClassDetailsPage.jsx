import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ClassContent from "./ClassContent.jsx";
import { useChat } from "../../context/ChatContext.jsx";
import { FaHome } from "react-icons/fa";

const ClassDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setClassId } = useChat();
    const [classDetails, setClassDetails] = useState(null);
    const [classes, setClasses] = useState([]);

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
            const res = await axios.get("http://localhost:5000/api/class/subscribe", {
                withCredentials: true,
            });
            setClasses(res.data.classes);
        } catch (error) {
            console.error("Error fetching subscribed classes:", error);
        }
    };

    const fetchClassDetails = async (classId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/class/get-class/${classId}`, {
                withCredentials: true,
            });
            setClassDetails(res.data.class);
        } catch (error) {
            console.error("Error fetching class details:", error);
        }
    };

    return (
        <div className="flex h-screen overflow-y-clip">
            <div className="w-1/4 relative bg-gray-200 p-4 border-r overflow-y-auto">
                <div className="flex justify-between">
                    <h2 className="text-lg font-bold mb-4">Subscribed Classes</h2>
                    <FaHome
                        onClick={() => navigate("/")}
                        className="cursor-pointer text-2xl">
                        Home
                    </FaHome>
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

            <ClassContent classDetails={classDetails} id={id} />
        </div >
    );
};

export default ClassDetailsPage;
