import React, { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const Profile = () => {
    const { user, logout, updateProfile, deleteProfile } = useAuth();
    const navigate = useNavigate();
    const clickProfile = useRef(null);

    const [profilePic, setProfilePic] = useState(null);

    const handleDeleteProfile = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");
        if (confirmDelete) {
            try {
                await deleteProfile();
                alert("Profile deleted successfully!");
                navigate("/login");
            } catch (error) {
                alert("Failed to delete profile. Please try again.");
            }
        }
    };

    const handleImageClick = () => {
        if (clickProfile.current) {
            clickProfile.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Image = reader.result;
            setProfilePic(base64Image);
            await updateProfile({ profilePic: base64Image });
        };
    };

    return (
        <div className="min-h-screen flex items-center rounded-4xl justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">

                {/* Username */}
                <div className="mb-2 p-2 text-3xl font-bold text-blue-600 italic text-center">
                    {user.username}
                </div>

                {/* Profile Picture */}
                <div className="mb-4 hidden" >
                    <label className="hidden text-sm font-medium mb-2">Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        ref={clickProfile}
                        onChange={(e) => handleFileChange(e)} // Set file instead of URL
                        className="w-full p-2 border rounded"
                    />
                </div>


                <img
                    src={profilePic ? profilePic : user?.profilePic || "https://static.vecteezy.com/system/resources/previews/019/896/028/original/add-new-user-icon-in-black-colors-profile-avatar-with-plus-symbol-png.png"}
                    alt="Profile"
                    onClick={handleImageClick}
                    className="h-40 w-40 mx-auto rounded-full border-2 mb-4 border-blue-400"
                />

                {/* Display Non-Editable Fields */}
                <table className="w-full border-collapse border border-gray-300 rounded-lg shadow-md">
                    <tbody>
                        <tr className="bg-blue-100">
                            <td className="px-4 py-2 font-semibold border border-gray-300">Classes Joined</td>
                            <td className="px-4 py-2 border border-gray-300">{user?.classesJoined?.length || 0}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-semibold border border-gray-300">Classes Created</td>
                            <td className="px-4 py-2 border border-gray-300">{user?.createdClasses?.length || 0}</td>
                        </tr>
                        <tr className="bg-blue-100">
                            <td className="px-4 py-2 font-semibold border border-gray-300">Friends</td>
                            <td className="px-4 py-2 border font-serif italic border-gray-300">{/*user?.friends?.length || 0*/}Coming Soon</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-semibold border border-gray-300">Badges</td>
                            <td className="px-4 py-2 border font-serif italic border-gray-300">{/*user?.badges?.length || 0*/}Coming Soon</td>
                        </tr>
                        <tr className="bg-blue-100">
                            <td className="px-4 py-2 font-semibold border border-gray-300">Stars</td>
                            <td className="px-4 py-2 border font-serif italic border-gray-300">{/*user?.stars || 0*/}Coming Soon</td>
                        </tr>
                    </tbody>
                </table>


                <hr className="text-blue-400 mb-6" />

                <div className="flex justify-around">
                    {/* Home Button */}
                    <FaHome
                        onClick={() => navigate("/")}
                        className="text-2xl text-green-600"
                    >
                        Home
                    </FaHome>

                    {/* Delete Profile Button */}
                    <MdDelete
                        onClick={handleDeleteProfile}
                        className="text-2xl text-red-600"
                    >
                        Delete Profile
                    </MdDelete>

                    {/* Logout Button */}
                    <FiLogOut
                        onClick={async () => {
                            await logout();
                            navigate("/login");
                        }}
                        className="text-2xl text-blue-600"
                    >
                        Logout
                    </FiLogOut>

                </div>

            </div>
        </div>
    );
};

export default Profile;