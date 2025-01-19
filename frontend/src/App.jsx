import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import IsLoggedIn from "./components/IsLoggedIn";
import Logout from "./components/Logout";

function App() {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/chat/:username?" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/profile/:username?" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/logout" element={<Logout />} />

      {/* Restricted Routes */}
      <Route path="/login" element={<IsLoggedIn><Login /></IsLoggedIn>} />
      <Route path="/register" element={<IsLoggedIn><Register /></IsLoggedIn>} />
    </Routes>
  );
}

export default App;