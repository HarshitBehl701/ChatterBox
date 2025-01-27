  import React from "react";
  import { Routes, Route } from "react-router-dom";
  import ProtectedRoute from "./components/ProtectedRoute";
  import IsLoggedIn from "./components/IsLoggedIn";
  import Logout from "./components/Logout";
  import Home from "./pages/Home";
  import Chat from "./pages/Chat";
  import Profile from "./pages/Profile";
  import Login from "./pages/Login";
  import Register from "./pages/Register";
  import Groups from "./pages/Groups";
  import GroupChat from "./pages/GroupChat";
  import GroupDetail from "./pages/GroupDetail";

  function App() {
    return (
      <Routes>
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
        <Route path="/group_chat/:groupname" element={<ProtectedRoute><GroupChat /></ProtectedRoute>} />
        <Route path="/group_detail/:groupname" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
        <Route path="/chat/:friendUsername" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/profile/:profileVisitUsername?" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/logout" element={<Logout />} />

        {/* Restricted Routes */}
        <Route path="/login" element={<IsLoggedIn><Login /></IsLoggedIn>} />
        <Route path="/register" element={<IsLoggedIn><Register /></IsLoggedIn>} />
      </Routes>
    );
  }

  export default App;