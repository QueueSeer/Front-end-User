import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";
import Fillter from "./pages/Login/Fillter";
import ForgotPassword from "./pages/Login/ForgotPassword";
import "./index.css";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* เส้นทางสำหรับหน้า Login */}
        <Route path="/" element={<Login />} />

   
        {/* เส้นทางสำหรับฟอร์มต่าง ๆ */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fillter" element={<Fillter />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      
      </Routes>
    </Router>
  );
}