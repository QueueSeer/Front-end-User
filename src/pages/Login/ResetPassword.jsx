import React, { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isReset, setIsReset] = useState(false);

  // ทำ logging เพื่อตรวจสอบ token
  console.log("Reset Password page loaded, token:", token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    if (password !== confirmPassword) {
      setMessage("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      console.log("Sending request to API...");
      const response = await fetch("https://backend.qseer.app/api/user/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      console.log("API response status:", response.status);
      
      if (response.ok) {
        setIsReset(true);
        setMessage("ตั้งค่ารหัสผ่านใหม่สำเร็จแล้ว");
      } else {
        const data = await response.json();
        console.log("API error response:", data);
        setMessage(data.detail || "เกิดข้อผิดพลาด โปรดลองอีกครั้ง");
      }
    } catch (error) {
      console.error("API request error:", error);
      setMessage("ไม่สามารถตั้งรหัสผ่านได้ โปรดลองใหม่ภายหลัง");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100 dark:bg-gray-900">
      <div className="p-8 rounded-xl shadow-lg w-full max-w-lg bg-white dark:bg-gray-800 dark:text-white">
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
                className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <button type="submit" className="w-full py-3 px-6 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
              Set New Password
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="mt-6 text-base text-center text-green-500">{message}</p>
            <button 
              onClick={() => navigate("/login")} 
              className="mt-4 w-full py-3 px-6 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              Go to Login
            </button>
          </div>
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