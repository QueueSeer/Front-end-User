import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = ({ isDarkMode }) => {
  const { token } = useParams(); // รับ token จาก URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("รหัสผ่านไม่ตรงกัน กรุณาลองใหม่");
      return;
    }

    try {
      const response = await fetch(`https://your-api.com/api/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setMessage("ตั้งค่ารหัสผ่านใหม่สำเร็จ! กรุณาเข้าสู่ระบบ");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      setMessage("ไม่สามารถตั้งค่ารหัสผ่านได้ โปรดลองใหม่ภายหลัง");
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`p-8 rounded-xl shadow-lg w-full max-w-lg sm:max-w-xl lg:max-w-2xl ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
        <h2 className="text-3xl font-semibold mb-8 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="password" className={`block text-lg font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? "border-gray-600 bg-gray-700 text-white focus:ring-purple-700" : "border-gray-300 bg-white text-gray-900 focus:ring-purple-500"}`}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirm-password" className={`block text-lg font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? "border-gray-600 bg-gray-700 text-white focus:ring-purple-700" : "border-gray-300 bg-white text-gray-900 focus:ring-purple-500"}`}
            />
          </div>
          <button type="submit" className="w-full py-3 px-6 rounded-lg bg-purple-500 text-white hover:bg-purple-600">
            Set New Password
          </button>
        </form>
        {message && <p className="mt-6 text-base text-center text-gray-500">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
