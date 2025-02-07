import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/profile');
        } catch (error) {
            alert(error);
        }
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg border border-gray-200 backdrop-blur-md bg-opacity-80"
                >
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>

                    <div className="mb-4">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                    >
                        Login
                    </button>

                    <button
                        type="submit"
                        onClick={() => navigate('/register')}
                        className="block w-full my-5 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 text-center"
                    >
                        Regsiter
                    </button>
                </form>
            </div>
        </>
    );
};

export default Login;
