import React, { useState } from "react";
import Images from "../../assets";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/index";

const API_BASE_URL = 'https://backend.qseer.app';

const SummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCoins, selectedPrice, selectedPayment, currentCoins, userName, from } = location.state || {};

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

 // ฟังก์ชันสำหรับชำระเงิน (ไปยังหน้า QR)
const handleConfirmPayment = async () => {
  if (!selectedCoins || selectedCoins <= 0 || !selectedPrice) {
    setError('กรุณาเลือกแพ็กเกจและจำนวนเงินให้ถูกต้อง');
    return;
  }

  // เริ่มแสดงสถานะโหลด
  setIsLoading(true);
  setError(null);
  
  try {
    // เรียก API เพื่อสร้าง QR Code สำหรับชำระเงิน
    const response = await fetch(`${API_BASE_URL}/api/transaction/qr_promptpay?amount=${selectedPrice}`, {
      method: 'GET',
      credentials: 'include'
    });
    
    let qrCodeData = null;
    let apiSuccess = false;
    
    if (response.ok) {
      // ได้รับ QR Code เป็น text (base64 หรือ URL)
      qrCodeData = await response.text();
      apiSuccess = true;
    } else {
      if (response.status === 401) {
        setError("กรุณาเข้าสู่ระบบเพื่อทำรายการ");
      } else if (response.status === 422) {
        setError("จำนวนเงินไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
      } else {
        try {
          const errorData = await response.json();
          setError(errorData.detail || "ไม่สามารถสร้าง QR Code ได้ โปรดลองอีกครั้ง");
        } catch (e) {
          setError("ไม่สามารถสร้าง QR Code ได้ โปรดลองอีกครั้ง");
        }
      }
    }
    
    // รอ 3 วินาทีก่อนดำเนินการต่อ ไม่ว่า API จะสำเร็จหรือไม่ก็ตาม
    setTimeout(() => {
      // ปิดสถานะโหลด
      setIsLoading(false);
      
      if (apiSuccess) {
        // นำทางไปหน้า QR Summary หากการเรียก API สำเร็จ
        navigate("/qr-summary", {
          state: {
            updatedCoins: currentCoins,
            selectedCoins,
            selectedPrice,
            selectedPayment,
            currentCoins,
            userName,
            from,
            qrCodeData
          }
        });
      }
      // หาก API ไม่สำเร็จ ก็ไม่ต้องนำทางไปไหน จะแสดงข้อความแจ้งเตือน error แทน
    }, 3000); // รอ 3 วินาที
    
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการสร้าง QR Code:", error);
    setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ โปรดลองอีกครั้ง");
    
    // ถ้าไม่สามารถเชื่อมต่อกับ API ได้ ก็ยังรอ 3 วินาทีเช่นกัน
    setTimeout(() => {
      setIsLoading(false);
      
      // ไปที่หน้า QR โดยไม่มี QR Code จาก API
      navigate("/qr-summary", {
        state: {
          updatedCoins: currentCoins,
          selectedCoins,
          selectedPrice,
          selectedPayment,
          currentCoins,
          userName,
          from
          // ไม่มี qrCodeData ทำให้หน้า QR ใช้รูปเริ่มต้น
        }
      });
    }, 3000); // รอ 3 วินาที
  }
};

  return (
    <>
    {/* Navbar ตรึงด้านบน */}
    <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <Navbar />
    </div>
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <svg
            className="animate-spin h-12 w-12 text-[#65558F]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
            ></path>
          </svg>
        </div>
      )}

      {/* Back Button */}
      <div className="absolute top-16 left-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-full px-4 py-3 mt-5"
        >
          <img src={Images.backtoback} alt="Arrow Left Icon" className="w-2 h-3" />
          <span className="text-sm">ย้อนกลับ</span>
        </button>
      </div>

      {/* แสดงข้อความแจ้งเตือนถ้ามี error */}
      {error && (
        <div className="max-w-lg w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Card Container */}
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg overflow-hidden mt-10">
        {/* Image Section */}
        <div className="relative w-full h-48 bg-gray-200">
          <img
            src={Images.Packetphoto}
            alt="Packet"
            className="w-full h-full object-cover"
          />
          <img
            src={Images.logomarbeltext}
            alt="Logo"
            className="absolute top-[83%] left-1/2 transform -translate-x-1/2 w-16"
          />
        </div>

        {/* Summary Details */}
        <div className="p-6 bg-gray-100 rounded-lg pb-5">
          <div className="flex justify-between items-center mt-5">
            <span className="text-gray-600 font-medium">จำนวนทั้งหมด</span>
            <span className="font-bold text-gray-800">🔮 {selectedCoins} คอยน์</span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600 font-medium">ราคา</span>
            <span className="font-bold text-gray-800">{selectedPrice?.toFixed(2) || 0} บาท</span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600 font-medium">ช่องทางการชำระเงิน</span>
            <span className="font-bold text-gray-800">{selectedPayment || "QR"}</span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600 font-medium">ชื่อผู้ใช้</span>
            <span className="font-bold text-gray-800">{userName || "Surangkanang"}</span>
          </div>
        </div>

        {/* Confirm Payment Button */}
        <div className="p-6 bg-white">
          <button
            className={`w-full py-3 text-center font-semibold rounded-lg shadow-md ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#65558F] text-white hover:bg-[#5A189A]"
            }`}
            onClick={handleConfirmPayment}
            disabled={isLoading}
          >
            ทำการชำระเงิน
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default SummaryPage;