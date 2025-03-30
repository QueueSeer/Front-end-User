import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Images from "../../assets"; 
import Navbar from "../../components/navbar/index";

const API_BASE_URL = 'https://backend.qseer.app';

const QrSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    selectedCoins, 
    selectedPrice, 
    currentCoins, 
    userName, 
    from, 
    qrCodeData,
    auction_id // รับค่า auction_id จาก location.state
  } = location.state || {};

  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 นาที
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false); // เพิ่ม state สำหรับ popup แสดงความสำเร็จ
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatedCoins, setUpdatedCoins] = useState(currentCoins);
  const [expiryTime, setExpiryTime] = useState('');

  // เลื่อนไปที่จุดเริ่มต้นของหน้าเมื่อโหลดหน้านี้
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ตั้งค่าวันหมดอายุเมื่อโหลดหน้า
  useEffect(() => {
    // สร้างวันหมดอายุ (15 นาทีจากเวลาปัจจุบัน)
    const expiryDate = new Date(new Date().getTime() + 15 * 60 * 1000);
    
    // แปลงเป็นรูปแบบไทย
    const day = expiryDate.getDate();
    const monthNames = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const month = monthNames[expiryDate.getMonth()];
    const year = expiryDate.getFullYear() + 543;
    const hours = expiryDate.getHours().toString().padStart(2, '0');
    const minutes = expiryDate.getMinutes().toString().padStart(2, '0');
    
    setExpiryTime(`${day} ${month} ${year}, ${hours}.${minutes} น.`);
  }, []);

  // นับเวลาถอยหลัง
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // ควบคุมให้ Popup บันทึก QR หายไปเองหลังจาก 1 วินาที
  useEffect(() => {
    if (isPopupOpen) {
      const timer = setTimeout(() => {
        setIsPopupOpen(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPopupOpen]);

  // แปลงเวลาถอยหลังเป็น นาที : วินาที
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} นาที ${secs} วินาที`;
  };

  // ฟังก์ชันยืนยันการชำระเงิน (เชื่อมต่อกับ API)
  const handleConfirmPayment = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // เรียก API เพื่อยืนยันการเติมเงิน
      const response = await fetch(`${API_BASE_URL}/api/transaction/confirm_topup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: selectedPrice }),
        credentials: 'include'
      });
      
      // แสดงสถานะโหลดอย่างน้อย 3 วินาที
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (response.ok) {
        const data = await response.json();
        const newCoins = data.coins; // รับค่า coins ใหม่จาก API
        
        // ปิดสถานะโหลด
        setIsLoading(false);
        
        // แสดง popup เติมเงินสำเร็จ
        setSuccessPopup(true);
        
        // รอ 2 วินาทีแล้วนำทางไปหน้าถัดไป
        setTimeout(() => {
          // เส้นทางการนำทางกลับขึ้นอยู่กับต้นทางที่มา
          if (from === "BidAuctionFooter") {
            // ส่ง auction_id และ updatedCoins กลับไปที่หน้า BidAuction
            navigate(`/bidAuction/${auction_id}`, { 
              state: { 
                updatedCoins: newCoins,
                auction_id: auction_id
              } 
            });
          } else {
            navigate("/top-up-coins", { state: { updatedCoins: newCoins } });
          }
        }, 2000);
      } else {
        // ปิดสถานะโหลด
        setIsLoading(false);
        
        if (response.status === 401) {
          setError("กรุณาเข้าสู่ระบบเพื่อทำรายการ");
        } else if (response.status === 404) {
          setError("ไม่พบข้อมูลผู้ใช้");
        } else {
          try {
            const errorData = await response.json();
            setError(errorData.detail || "เกิดข้อผิดพลาดในการยืนยันการเติมเงิน");
          } catch (e) {
            setError("เกิดข้อผิดพลาดในการยืนยันการเติมเงิน");
          }
        }
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการยืนยันการเติมเงิน:", error);
      
      // แสดงสถานะโหลดอย่างน้อย 3 วินาที
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIsLoading(false);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ โปรดลองอีกครั้ง");
      
      // ถ้าต้องการให้ทำงานแบบเดิมเมื่อไม่สามารถเชื่อมต่อ API ได้ (แบบ fallback)
      setTimeout(() => {
        const newUpdatedCoins = currentCoins + selectedCoins;
        setUpdatedCoins(newUpdatedCoins);
        
        // แสดง popup เติมเงินสำเร็จ
        setSuccessPopup(true);
        
        // รอ 2 วินาทีแล้วนำทางไปหน้าถัดไป
        setTimeout(() => {
          if (from === "BidAuctionFooter") {
            // ส่ง auction_id และ updatedCoins กลับไปที่หน้า BidAuction
            navigate(`/bidAuction/${auction_id}`, { 
              state: { 
                updatedCoins: newUpdatedCoins,
                auction_id: auction_id
              } 
            });
          } else {
            navigate("/top-up-coins", { state: { updatedCoins: newUpdatedCoins } });
          }
        }, 2000);
      }, 1000);
    }
  };

  // ฟังก์ชันบันทึก QR Code
  const handleSaveQR = () => {
    setIsPopupOpen(true);
    // ในสภาพแวดล้อมจริง อาจทำการ trigger การดาวน์โหลดภาพ QR Code ที่นี่
  };

  // ฟังก์ชันกลับไปหน้าก่อนหน้า
  const handleGoBack = () => {
    if (from === "BidAuctionFooter" && auction_id) {
      navigate(`/bidAuction/${auction_id}`, {
        state: { auction_id: auction_id }
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      {/* Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>

      <div className="flex flex-col items-center p-6 mt-16">
        {/* ปุ่มย้อนกลับ */}
        <div className="self-start mb-4">
          <button
            className="flex items-center text-gray-700 px-4 py-2 rounded-full border"
            onClick={handleGoBack}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ย้อนกลับ
          </button>
        </div>
        
        {/* แสดงข้อความแจ้งเตือนถ้ามี error */}
        {error && (
          <div className="w-full max-w-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* กล่องข้อมูลการชำระเงิน */}
        <div className="border rounded-lg p-6 shadow-md bg-white max-w-lg w-full">
          {/* แสดงยอดชำระ */}
          <div className="flex justify-between text-lg font-semibold">
            <span>ยอดชำระเงิน</span>
            <span>{selectedPrice?.toFixed(2) || "100.00"} บาท</span>
          </div>

          {/* ระยะเวลาชำระเงิน */}
          <div className="flex justify-between text-lg mt-2">
            <span>กรุณาชำระภายใน</span>
            <span>{formatTime(timeLeft)}</span>
          </div>
          <div className="text-sm text-gray-700 text-right mt-2">
            <span>หมดเวลา {expiryTime}</span>
          </div>

          {/* QR Code สำหรับชำระเงิน */}
          <div className="flex flex-col items-center mt-4">
            <img 
              src={qrCodeData || Images.qr} 
              alt="QR Code" 
              className="w-60 mt-2" 
            />
            <p className="text-lg font-semibold mt-2 text-[#65558F]">
              {selectedPrice?.toFixed(2) || "100.00"} บาท
            </p>
            <p className="text-gray-600 text-sm">บัญชี: นางสาวสุรางคนางค์ เกตุยั่งยืนวงศ์</p>
          </div>
        </div>

        {/* ปุ่มการกระทำ */}
        <div className="flex gap-6 mt-8">
          {/* ปุ่ม บันทึก QR */}
          <button
            className="px-12 py-4 rounded-lg border-2 border-[#8677A7] font-semibold text-[#65558F] text-lg bg-white hover:bg-[#F4F1FA] transition"
            onClick={handleSaveQR}
          >
            บันทึก QR
          </button>

          {/* ปุ่ม ตกลง */}
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

        {/* ข้อความแนะนำการชำระเงิน */}
        <div className="text-sm text-gray-700 mt-6 text-left max-w-lg">
          <ol className="list-decimal pl-5 space-y-1">
            <li>คลิกปุ่ม "บันทึก QR" หรือบันทึกหน้าจอ</li>
            <li>เปิดแอปพลิเคชันธนาคารบนอุปกรณ์ของคุณ</li>
            <li>เลือกไปที่ "สแกน" แล้วถ่ายหน้าจอ หรือกดไอคอน "รูปภาพ"</li>
            <li>เลือกภาพที่คุณบันทึกไว้ และทำการชำระเงิน</li>
            <li>หลังจากชำระเงินเสร็จสิ้น กรุณาตรวจสอบสถานะการชำระเงินในหน้า "ประวัติการเติมเงิน"</li>
            <li>หากสถานะไม่มีการเปลี่ยนแปลง ให้ติดต่อ 095-708-3131</li>
          </ol>
        </div>

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

        {/* Popup Modal บันทึก QR สำเร็จ */}
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold text-center text-gray-800">บันทึก QR สำเร็จ</h3>
            </div>
          </div>
        )}

        {/* Popup Modal เติมเงินสำเร็จ */}
        {successPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800">เติมโชคคอยสำเร็จ</h3>
              <p className="text-gray-600 text-center mt-2">คุณได้รับ {selectedCoins} คอยน์</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default QrSummary;