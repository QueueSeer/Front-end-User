import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Images from "../../assets";

const EmailVerification = () => {
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "fail"
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // รับ token จาก URL parameter แทนการใช้ cookie
    const token = searchParams.get("token");
    console.log("Token from URL:", token);

    if (token) {
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
            // ตั้งเวลารีไดเร็คไปหน้า login หลังจากแสดงข้อความสำเร็จ 3 วินาที
            setTimeout(() => {
              navigate("/login");
            }, 3000);
          } else {
            setStatus("fail");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setStatus("fail");
        });
    } else {
      console.log("ไม่พบ token ใน URL");
      setStatus("fail");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#65558F] p-4 sm:p-6 relative">
      <div className="bg-cover bg-center rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl h-[300px] sm:h-[350px] md:h-[400px] p-4 sm:p-6 text-center relative overflow-hidden"
        style={{ backgroundImage: `url(${Images.cardverify})` }}>
        
        {status === "loading" && (
          <div className="absolute top-[100px] sm:top-[120px] left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {status === "success" && (
          <div className="absolute top-[100px] sm:top-[120px] left-1/2 transform -translate-x-1/2 w-12 h-12 flex items-center justify-center">
            <img src={Images.tickcircle} alt="Tick" className="w-10 h-10" />
          </div>
        )}
        
        {status === "fail" && (
          <div className="absolute top-[100px] sm:top-[120px] left-1/2 transform -translate-x-1/2 w-12 h-12 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        )}

        <div className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 text-center">
          {status === "success" ? (
            <>
              <h1 className="text-base font-semibold text-black">เปิดใช้งานบัญชีแล้ว</h1>
              <p className="text-xs text-gray-600 mt-2">มาเริ่มการเป็นหมอดูที่ยอดเยี่ยมกันเถอะ</p>
              <p className="text-xs text-purple-600 mt-4">กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...</p>
            </>
          ) : status === "fail" ? (
            <>
              <h1 className="text-base font-semibold text-red-600">การยืนยันล้มเหลว</h1>
              <p className="text-xs text-gray-600 mt-2">กรุณาลองอีกครั้งหรือติดต่อผู้ดูแลระบบ</p>
              <button 
                onClick={() => navigate("/login")} 
                className="mt-4 px-4 py-2 bg-purple-600 text-white text-xs rounded-full hover:bg-purple-700 transition-colors"
              >
                กลับไปยังหน้าเข้าสู่ระบบ
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-600">กำลังยืนยันบัญชี...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;