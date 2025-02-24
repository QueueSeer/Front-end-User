import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationCard from "../../components/bookingcomponent/step4/ConfirmationCard";
import HowToUseCode from "../../components/bookingcomponent/step4/HowToUseCode";
import Navbar from "../../components/navbar"; // ✅ ใช้ path ที่ถูกต้อง

const BookingSeer4 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // ✅ ทำให้หน้าเริ่มต้นที่ด้านบนสุดเมื่อโหลด
  }, []);

  return (
    <>
      {/* ✅ Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>

      {/* ✅ เพิ่ม pt-16 เพื่อป้องกัน Navbar ทับเนื้อหา */}
      <div className="flex flex-col items-center p-6 pt-16 min-h-screen">
        {/* ✅ การจองเสร็จสิ้น */}
        <ConfirmationCard />

        {/* ✅ วิธีการใช้ Code */}
        <HowToUseCode />

        {/* ✅ ปุ่มการกระทำ */}
        <div className="w-full flex justify-end gap-4 mt-auto pr-6">
          <button
            className="px-6 py-3 rounded-lg border-2 border-[#65558F] font-semibold text-[#65558F] text-base bg-white hover:bg-[#F4F1FA] transition"
            onClick={() => navigate("/home")}
          >
            หน้าหลัก
          </button>
          <button
            className="px-6 py-3 rounded-lg font-semibold text-white bg-[#65558F] hover:bg-[#564477] text-base transition"
            onClick={() => navigate("/booking")}
          >
            จองคิว
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingSeer4;
