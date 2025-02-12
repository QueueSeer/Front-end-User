import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../assets"; 

const BookingSeer3 = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 นาที
  const [isPopupOpen, setIsPopupOpen] = useState(false); // ✅ ควบคุมการแสดงผล Popup

  // ⏳ นับเวลาถอยหลัง
  // ✅ ใช้ useEffect ควบคุมให้ Popup หายไปเองใน 3 วินาที
useEffect(() => {
  if (isPopupOpen) {
    const timer = setTimeout(() => {
      setIsPopupOpen(false);
    }, 1000); // 1 วินาที
    return () => clearTimeout(timer);
  }
}, [isPopupOpen]);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // 🕒 แปลงเวลาถอยหลังเป็น นาที : วินาที
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} นาที ${secs} วินาที`;
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* 🛑 กล่องข้อมูลการชำระเงิน */}
      <div className="border rounded-lg p-6 shadow-md bg-white max-w-lg w-full">
        {/* 💰 แสดงยอดชำระ */}
        <div className="flex justify-between text-lg font-semibold">
          <span>ยอดชำระเงิน</span>
          <span>298.00 บาท</span>
        </div>

        {/* ⏳ ระยะเวลาชำระเงิน */}
        <div className="flex justify-between text-lg mt-2">
          <span>กรุณาชำระภายใน</span>
          <span>{formatTime(timeLeft)}</span>
        </div>
        <div className="text-sm text-gray-700 text-right mt-2">
          <span>หมดเวลา 14 กันยายน 2567, 10.00 น.</span>
        </div>

        {/* 🔳 QR Code สำหรับชำระเงิน */}
        <div className="flex flex-col items-center mt-4">
          <img src={Images.qr} alt="QR Code" className="w-60 mt-2" />
          <p className="text-lg font-semibold mt-2 text-[#65558F]">298.00 บาท</p>
          <p className="text-gray-600 text-sm">บัญชี: บางสาวสุรางคณางค์ เกตุยั่งยืนวงศ์</p>
        </div>
      </div>

      {/* 🔘 ปุ่มการกระทำ */}
<div className="flex gap-6 mt-8">
  {/* ปุ่ม บันทึก QR (ขอบม่วง, พื้นหลังขาว, ตัวอักษรม่วง) */}
  <button
    className="px-12 py-4 rounded-lg border-2 border-[#8677A7] font-semibold text-[#65558F] text-lg bg-white hover:bg-[#F4F1FA] transition"
    onClick={() => setIsPopupOpen(true)}
  >
    บันทึก QR
  </button>

  {/* ปุ่ม ตกลง (พื้นหลังม่วง, ตัวอักษรสีขาว) */}
  <button
    className="px-12 py-4 rounded-lg font-semibold text-white bg-[#8677A7] hover:bg-[#564477] text-lg transition"
    onClick={() => navigate("/bookingSeer4")}
  >
    ตกลง
  </button>
</div>


      {/* ℹ️ ข้อความแนะนำการชำระเงิน */}
      <div className="text-sm text-gray-700 mt-6 text-left max-w-lg">
        <ol className="list-decimal pl-5 space-y-1">
          <li>คลิกปุ่ม “บันทึก QR” หรือบันทึกหน้าจอ</li>
          <li>เปิดแอปพลิเคชันธนาคารบนอุปกรณ์ของคุณ</li>
          <li>เลือกไปที่ “สแกน” แล้วถ่ายหน้าจอ หรือกดไอคอน “รูปภาพ”</li>
          <li>เลือกภาพที่คุณบันทึกไว้ และทำการชำระเงิน</li>
          <li>หลังจากชำระเงินเสร็จสิ้น กรุณาตรวจสอบสถานะการชำระเงินในหน้า “ประวัติการเติมเงิน”</li>
          <li>หากสถานะไม่มีการเปลี่ยนแปลง ให้ติดต่อ 095-708-3131</li>
        </ol>
      </div>

    {/* ✅ Popup Modal (แสดง 3 วินาทีแล้วหายไป) */}
{isPopupOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h3 className="text-lg font-semibold text-center text-gray-800">บันทึก QR สำเร็จ</h3>
    </div>
  </div>
)}



 
    </div>
  );
};

export default BookingSeer3;
