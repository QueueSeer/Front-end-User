import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // เพิ่ม useLocation
import ConfirmationCard from "../../components/bookingcomponent/step4/ConfirmationCard";
import HowToUseCode from "../../components/bookingcomponent/step4/HowToUseCode";
import Navbar from "../../components/navbar";

const BookingSeer4 = () => {
  const navigate = useNavigate();
  const location = useLocation(); // เพิ่มเพื่อรับข้อมูลจาก navigation
  
  // รับข้อมูลการจองจาก location.state
  const bookingData = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // ตรวจสอบว่ามีข้อมูลการจองหรือไม่
    if (!bookingData || Object.keys(bookingData).length === 0) {
      console.error("ไม่พบข้อมูลการจอง");
      // อาจจะ redirect กลับไปที่หน้าแรก
      // navigate("/");
    }
  }, [bookingData, navigate]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>

      <div className="flex flex-col items-center p-6 pt-16 min-h-screen">
        {/* ส่งข้อมูลการจองไปยัง ConfirmationCard */}
        <ConfirmationCard bookingData={bookingData} />

        <HowToUseCode />

        <div className="w-full flex justify-end gap-4 mt-auto pr-6">
          <button
            className="px-6 py-3 rounded-lg border-2 border-[#65558F] font-semibold text-[#65558F] text-base bg-white hover:bg-[#F4F1FA] transition"
            onClick={() => navigate("/home")}
          >
            หน้าหลัก
          </button>
          <button
            className="px-6 py-3 rounded-lg font-semibold text-white bg-[#65558F] hover:bg-[#564477] text-base transition"
            onClick={() => navigate("/queuehistory")}
          >
            จองคิว
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingSeer4;