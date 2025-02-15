import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationCard from "../../components/bookingcomponent/step4/ConfirmationCard";
import HowToUseCode from "../../components/bookingcomponent/step4/HowToUseCode";

const BookingSeer4 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // ทำให้หน้าเริ่มต้นที่ด้านบนสุดเมื่อโหลด
  }, []);

  return (
    <div className="flex flex-col items-center p-6">
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
  );
};

export default BookingSeer4;
