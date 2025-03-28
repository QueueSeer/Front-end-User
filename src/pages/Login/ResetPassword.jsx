import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        setMessage("บันทึกรหัสผ่านใหม่เรียบร้อย กรุณาเข้าสู่ระบบอีกครั้ง");
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
    <div className="min-h-screen flex items-center justify-center bg-purple-700 p-4 relative">
      {/* ลวดลาย + ในพื้นหลัง */}
      <div className="absolute top-8 left-8">
        <div className="grid grid-cols-8 gap-2">
          {Array(64).fill().map((_, i) => (
            <div key={i} className="w-2 h-2 text-white flex items-center justify-center">+</div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-8 left-8">
        <div className="grid grid-cols-6 gap-2">
          {Array(36).fill().map((_, i) => (
            <div key={i} className="w-2 h-2 text-white flex items-center justify-center">+</div>
          ))}
        </div>
      </div>
      
      <div className="absolute top-8 right-8">
        <div className="grid grid-cols-6 gap-2">
          {Array(36).fill().map((_, i) => (
            <div key={i} className="w-2 h-2 text-white flex items-center justify-center">+</div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-8 right-8">
        <div className="grid grid-cols-8 gap-2">
          {Array(64).fill().map((_, i) => (
            <div key={i} className="w-2 h-2 text-white flex items-center justify-center">+</div>
          ))}
        </div>
      </div>
      
      {/* กล่องตรงกลาง */}
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl">
        {isReset ? (
          // หน้ารีเซ็ตรหัสผ่านสำเร็จ
          <>
            <div className="bg-purple-500 h-24 rounded-b-full relative">
              <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
                <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            
            <div className="py-8 px-6 pt-12 text-center">
              <h1 className="text-base font-semibold text-gray-900 mb-1">
                บันทึกรหัสผ่านใหม่เรียบร้อย
              </h1>
              <p className="text-xs text-gray-500 mb-6">
                กรุณาเข้าสู่ระบบอีกครั้ง
              </p>
              
              <Link 
                to="/login" 
                className="block w-full py-2.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition duration-200 text-center"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </>
        ) : (
          // หน้าฟอร์มรีเซ็ตรหัสผ่าน
          <>
            <h2 className="text-xl font-semibold mt-6 text-center">รีเซ็ตรหัสผ่าน</h2>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium mb-1">รหัสผ่านใหม่</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="p-2.5 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 pr-10"
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">ยืนยันรหัสผ่านใหม่</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="p-2.5 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 pr-10"
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                {message && !isReset && (
                  <p className="mb-4 text-sm text-center text-red-500">{message}</p>
                )}
                
                <button type="submit" className="w-full py-2.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition duration-200">
                  บันทึกรหัสผ่านใหม่
                </button>
                
               
              </form>
            </div>
          </>
        )}
      </div>
      
      {/* วงกลมเส้นประตกแต่งในพื้นหลัง */}
      <div className="absolute top-16 right-16 border border-dashed border-white/40 rounded-full w-8 h-8"></div>
      <div className="absolute top-32 right-24 border border-dashed border-white/40 rounded-full w-16 h-16"></div>
      <div className="absolute bottom-24 left-16 border border-dashed border-white/40 rounded-full w-16 h-16"></div>
      <div className="absolute bottom-16 left-36 border border-dashed border-white/40 rounded-full w-8 h-8"></div>
    </div>
  );
};

export default ResetPassword;