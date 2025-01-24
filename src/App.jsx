import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";
import Fillter from "./pages/Login/Fillter";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ResetPassword from "./pages/Login/ResetPassword";
import Homepage from "./pages/home/Homepage";
import "./index.css";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); // เพิ่มตัวแปร isDarkMode

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fillter" element={<Fillter />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword isDarkMode={isDarkMode} />} />
        <Route path="/homepage" element={<Homepage />} />
      </Routes>
    </Router>
  );
}
