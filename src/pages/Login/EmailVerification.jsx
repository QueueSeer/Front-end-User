import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const EmailVerification = () => {
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "fail"
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verificationAttempted = useRef(false); // ใช้ ref เพื่อเก็บสถานะว่าได้พยายามตรวจสอบ token แล้วหรือไม่

  useEffect(() => {
    // รับ token จาก URL parameter
    const token = searchParams.get("token");
    console.log("Token from URL:", token);

    // ตรวจสอบว่าเคยพยายามตรวจสอบ token นี้แล้วหรือไม่
    if (token && !verificationAttempted.current) {
      // ตั้งค่า ref เพื่อไม่ให้ยิง request ซ้ำ
      verificationAttempted.current = true;
      
      // แสดงสถานะ loading
      setStatus("loading");
      
      // เรียก API เพื่อตรวจสอบ token
      fetch(`https://backend.qseer.app/api/user/verify/${token}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include", 
      })
        .then(async (response) => {
          const data = await response.json();
          console.log("Response:", response.status, data);
          
          if (response.status === 200) {
            setStatus("success");
          } else {
            setStatus("fail");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setStatus("fail");
        });
    } else if (!token) {
      console.log("ไม่พบ token ใน URL");
      setStatus("fail");
    }
  }, [searchParams]); // ยังคงใช้ searchParams เป็น dependency

  // ฟังก์ชันสำหรับเข้าสู่ระบบ
  const handleLogin = () => {
    navigate("/login");
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
        {/* ส่วนบนสีม่วง */}
        <div className="bg-purple-500 h-24 rounded-b-full relative">
          {/* วงกลมตรงกลางสำหรับไอคอน */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
            {status === "loading" ? (
              <div className="w-6 h-6 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            ) : status === "success" ? (
              <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            ) : (
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            )}
          </div>
        </div>
        
        {/* เนื้อหา */}
        <div className="py-8 px-6 pt-12 text-center">
          <h1 className="text-base font-semibold text-gray-900 mb-1">
            {status === "loading" 
              ? "กำลังตรวจสอบ..." 
              : status === "success" 
                ? "เปิดใช้งานบัญชีแล้ว" 
                : "การยืนยันล้มเหลว"}
          </h1>
          <p className="text-xs text-gray-500 mb-6">
            {status === "loading" 
              ? "กรุณารอสักครู่..." 
              : status === "success" 
                ? "มาเริ่มการเป็นหมอดูที่ยอดเยี่ยมกันเถอะ" 
                : "กรุณาลองอีกครั้งหรือติดต่อผู้ดูแลระบบ"}
          </p>
          
          <button 
            onClick={handleLogin}
            className="w-full py-2.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition duration-200"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
      
      {/* วงกลมเส้นประตกแต่งในพื้นหลัง */}
      <div className="absolute top-16 right-16 border border-dashed border-white/40 rounded-full w-8 h-8"></div>
      <div className="absolute top-32 right-24 border border-dashed border-white/40 rounded-full w-16 h-16"></div>
      <div className="absolute bottom-24 left-16 border border-dashed border-white/40 rounded-full w-16 h-16"></div>
      <div className="absolute bottom-16 left-36 border border-dashed border-white/40 rounded-full w-8 h-8"></div>
    </div>
  );
};

export default EmailVerification;