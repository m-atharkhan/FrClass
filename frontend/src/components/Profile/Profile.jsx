import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, logout, updateProfile, deleteProfile } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState(user?.username || "");
    const [profilePic, setProfilePic] = useState(user?.profilePic || "");

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await updateProfile({ username, profilePic });
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6">Profile</h2>

                {/* Profile Picture */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Profile Picture URL</label>
                    <input
                        type="text"
                        value={profilePic}
                        onChange={(e) => setProfilePic(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Username */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Update Profile Button */}
                <button
                    onClick={handleUpdateProfile}
                    className="w-full bg-blue-500 text-white p-2 rounded mb-4"
                >
                    Update Profile
                </button>

                {/* Display Non-Editable Fields */}
                <div className="mb-4">
                    <p className="text-sm font-medium">Classes Joined: {user?.classesJoined?.length || 0}</p>
                    <p className="text-sm font-medium">Classes Created: {user?.createdClasses?.length || 0}</p>
                    <p className="text-sm font-medium">Friends: {user?.friends?.length || 0}</p>
                    <p className="text-sm font-medium">Badges: {user?.badges?.length || 0}</p>
                    <p className="text-sm font-medium">Stars: {user?.stars || 0}</p>
                </div>

                {/* Delete Profile Button */}
                <button
                    onClick={handleDeleteProfile}
                    className="w-full bg-red-600 text-white p-2 rounded mb-4"
                >
                    Delete Profile
                </button>

                {/* Logout Button */}
                <button
                    onClick={async () => {
                        await logout();
                        navigate("/login");
                    }}
                    className="w-full mb-2 bg-red-500 text-white p-2 rounded"
                >
                    Logout
                </button>

                <button
                    onClick={async () => {
                        navigate("/");
                    }}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Home
                </button>
            </div>
        </div>
    );
};

export default Profile;