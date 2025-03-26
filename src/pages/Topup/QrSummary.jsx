import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Images from "../../assets"; 
import Navbar from "../../components/navbar/index"; // เรียกใช้ path ที่ถูกต้อง

const QrSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCoins, currentCoins, from } = location.state || {}; // ✅ รับค่า state จาก SummaryPage

  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 นาที
  const [isPopupOpen, setIsPopupOpen] = useState(false); // ✅ ควบคุมการแสดงผล Popup
  const [isLoading, setIsLoading] = useState(false); // ✅ เพิ่มสถานะโหลด
  const [updatedCoins, setUpdatedCoins] = useState(currentCoins); // ✅ เก็บค่า Coins ที่อัปเดตล่าสุด

  // ⏳ ใช้ useEffect ควบคุมการนับเวลาถอยหลัง
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // ✅ ใช้ useEffect ควบคุมให้ Popup หายไปเอง
  useEffect(() => {
    if (isPopupOpen) {
      const timer = setTimeout(() => {
        setIsPopupOpen(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPopupOpen]);

  // 🕒 แปลงเวลาถอยหลังเป็น นาที : วินาที
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} นาที ${secs} วินาที`;
  };

  // ✅ ฟังก์ชันยืนยันการชำระเงิน
  const handleConfirmPayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUpdatedCoins = updatedCoins + selectedCoins; // อัปเดต Coins

      if (from === "BidAuctionFooter") {
        navigate("/bidAuction", { state: { updatedCoins: newUpdatedCoins } }); // ✅ กลับไปที่ BidAuction
      } else {
        navigate("/top-up-coins", { state: { updatedCoins: newUpdatedCoins } }); // กลับไปที่หน้าเติมเงินปกติ
      }
    }, 2000);
  };

  return (
    <>
      {/* Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>

      <div className="flex flex-col items-center p-6 mt-16">
        {/* 🛑 กล่องข้อมูลการชำระเงิน */}
        <div className="border rounded-lg p-6 shadow-md bg-white max-w-lg w-full">
          {/* 💰 แสดงยอดชำระ */}
          <div className="flex justify-between text-lg font-semibold">
            <span>ยอดชำระเงิน</span>
            <span>100.00 บาท</span>
          </div>

          {/* ⏳ ระยะเวลาชำระเงิน */}
          <div className="flex justify-between text-lg mt-2">
            <span>กรุณาชำระภายใน</span>
            <span>{formatTime(timeLeft)}</span>
          </div>
          <div className="text-sm text-gray-700 text-right mt-2">
            <span>หมดเวลา 24 กุมภาพันธ์ 2568, 3.00 น.</span>
          </div>

          {/* 🔳 QR Code สำหรับชำระเงิน */}
          <div className="flex flex-col items-center mt-4">
            <img src={Images.qr} alt="QR Code" className="w-60 mt-2" />
            <p className="text-lg font-semibold mt-2 text-[#65558F]">100.00 บาท</p>
            <p className="text-gray-600 text-sm">บัญชี: นางสาวสุรางคนางค์ เกตุยั่งยืนวงศ์</p>
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
            className={`px-12 py-4 rounded-lg font-semibold text-white text-lg transition ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#8677A7] hover:bg-[#564477]"
            }`}
            onClick={handleConfirmPayment}
            disabled={isLoading}
          >
            {isLoading ? "กำลังดำเนินการ..." : "ตกลง"}
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

        {/* ✅ Popup Modal (แสดง 1 วินาทีแล้วหายไป) */}
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold text-center text-gray-800">บันทึก QR สำเร็จ</h3>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default QrSummary;
