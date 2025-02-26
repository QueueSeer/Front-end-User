import React, { useState } from "react";
import Images from "../../../assets";


const ConfirmationCard = () => {
  const [isCopied, setIsCopied] = useState(false); // ✅ state สำหรับแจ้งเตือนการคัดลอก
  const [isPopupOpen, setIsPopupOpen] = useState(false); // ✅ state สำหรับ Popup บันทึกภาพ

  //  ฟังก์ชันคัดลอกโค้ด
  const copyCode = () => {
    navigator.clipboard.writeText("4QCFR"); // ✅ คัดลอกโค้ดไปที่ Clipboard
    setIsCopied(true); // ✅ แสดง "คัดลอกแล้ว!"
    setTimeout(() => setIsCopied(false), 1000); // ✅ หายไปใน 1 วิ
  };

  //  ฟังก์ชันแสดง Popup บันทึกภาพ
  const saveImage = () => {
    setIsPopupOpen(true); // ✅ เปิด Popup
    setTimeout(() => setIsPopupOpen(false), 1000); // ✅ หายไปใน 1 วิ
  };

  return (
    <div className="bg-[#E4E4E6] p-8 rounded-xl shadow-md max-w-lg w-full text-center relative">
      {/* ✅ ไอคอนเช็คถูก */}
      <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-[#E4E4E6] rounded-full p-4">
        <img src={Images.tickcircle} alt="Success" className="w-14" />
      </div>

      {/* ✅ ข้อความ */}
      <h2 className="text-xl font-bold mt-8">การจองคิวเสร็จสิ้น!</h2>
      <div className="flex justify-center items-center gap-2 mt-2">
        <p className="text-[#65558F] text-xl font-bold tracking-wide">4QCFR</p>
        <img 
          src={Images.Copy} 
          alt="Copy Code" 
          className="w-5 cursor-pointer" 
          onClick={copyCode} // ✅ กดแล้วคัดลอก
        />
        {isCopied && <span className="text-sm text-gray-500">คัดลอกแล้ว!</span>}
      </div>

      <hr className="my-4 border-gray-300" />

      {/* ✅ รายละเอียด */}
      <div className="text-sm text-gray-700 text-left px-6">
        <div className="grid grid-cols-2 gap-y-3">
          <p className="font-medium">ชื่อหมอดู</p>
          <p>เพียงฟ้า พาขวัญ</p>

          <p className="font-medium">แพ็กเกจ</p>
          <p>ความรักปีนี้เป็นอย่างไร  </p> 

          <p className="font-medium">ชื่อผู้จอง</p>
          <p>น.ส. สุรางคนางค์ เกตุยั่งยืนวงศ์</p>

          <p className="font-medium">วันเวลาที่จอง</p>
          <p>25/02/68 10:45 น.</p>

          <p className="font-medium">ช่องทางการติดต่อหมอดู</p>
          <p className="text-[#65558F] underline cursor-pointer">thrthtrhtrytjy</p>

          <p className="font-medium">รับการแจ้งเตือน</p>
          <p>2552598@gmail.com</p>
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      {/* ✅ ยอดรวม */}
      <p className="text-lg font-bold">
        ยอดรวม: <span className="text-black">49.00 บาท</span>
      </p>

      {/* ✅ ปุ่มบันทึกภาพ */}
      <button 
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg border font-semibold bg-white shadow-md text-[#65558F] mt-4"
        onClick={saveImage} // ✅ กดแล้วแสดง Popup
      >
        <img src={Images.importimages} alt="Save Image" className="w-5" />
        บันทึกภาพ
      </button>

      {/* ✅ Popup บันทึกภาพ (หายไปใน 1 วิ) */}
      {isPopupOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
      <p className="text-lg font-semibold text-gray-800"> บันทึกภาพแล้ว!</p>
    </div>
  </div>
)}

    </div>
  );
};

export default ConfirmationCard;
