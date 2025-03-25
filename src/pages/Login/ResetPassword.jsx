import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const ResetPassword = ({ isDarkMode }) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isReset, setIsReset] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const response = await fetch("https://backend.qseer.app/api/user/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setIsReset(true);
        setMessage("ตั้งค่ารหัสผ่านใหม่สำเร็จแล้ว");
      } else {
        const data = await response.json();
        setMessage(data.detail || "เกิดข้อผิดพลาด โปรดลองอีกครั้ง");
      }
    } catch (error) {
      setMessage("ไม่สามารถตั้งรหัสผ่านได้ โปรดลองใหม่ภายหลัง");
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen px-4 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`p-8 rounded-xl shadow-lg w-full max-w-lg ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
        <h2 className="text-3xl font-semibold mb-8 text-center">Reset Password</h2>
        {!isReset ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-lg font-medium">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-lg font-medium">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
            <button type="submit" className="w-full py-3 px-6 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
              Set New Password
            </button>
          </form>
        ) : (
          <p className="mt-6 text-base text-center text-green-500">{message}</p>
        )}
        {message && !isReset && (
          <p className="mt-4 text-base text-center text-red-500">{message}</p>
        )}
        <div className="mt-8 text-center text-base">
          <Link to="/login" className="text-purple-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
