import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Profile from "./components/Profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ClassPage from "./components/Class/ClassPage";
import ClassDetailsPage from "./components/Class/ClassDetailsPage";
import { ChatProvider } from "./context/ChatContext";

const App = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ClassPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/class/:id" element={<ClassDetailsPage />} />
            </Route>
          </Routes>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;
