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

    const [username, setUsername] = useState(user?.username || "");
    const [profilePic, setProfilePic] = useState(user?.profilePic || "");

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("username", username);
        if (profilePic) {
            formData.append("image", profilePic);
        }

        try {
            const response = await updateProfile(formData);
            if (response?.user?.profilePic) {
                setProfilePic(response.user.profilePic);
            }
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Failed to update profile. Please try again.");
        }
    };


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

    const handleFileChange = (e) => {
        console.log(e.target.files[0]);
        setProfilePic(e.target.files[0]);
        console.log(profilePic)
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl text-center text-blue-600 font-bold mb-2">Profile</h2>

                {/* Profile Picture */}
                <div className="mb-4 hidden" >
                    <label className="hidden text-sm font-medium mb-2">Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        ref={clickProfile}
                        onChange={handleFileChange} // Set file instead of URL
                        className="w-full p-2 border rounded"
                    />
                </div>


                <img
                    src={profilePic ? URL.createObjectURL(profilePic) : user?.profilePic || "https://th.bing.com/th/id/OIP.ln3Rd8nn4BPJY7i5g9WWmAHaG6?rs=1&pid=ImgDetMain"}
                    alt="Profile"
                    onClick={handleImageClick}
                    className="w-40 h-40 mx-auto rounded-full border-2 border-blue-400"
                />

                {/* Username */}
                <div className="mb-2">
                    <label className="block text-blue-600 text-sm font-medium mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-blue-400 rounded-2xl"
                    />
                </div>

                {/* Update Profile Button */}
                <button
                    onClick={handleUpdateProfile}
                    className="w-full cursor-pointer bg-blue-500 text-white p-2 rounded mb-4"
                >
                    Update Profile
                </button>

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