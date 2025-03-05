import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Images from "../../assets"; 
import Navbar from "../../components/navbar";
import axios from "axios";


const BookingSeer3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // รับค่าจาก BookingSeer2
  const bookingData = location.state || {};
  const { packageInfo, finalPrice, userInfo } = bookingData;
  
  // QR Code state
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrLoading, setQrLoading] = useState(true);
  const [qrError, setQrError] = useState(null);
  
  // นับเวลาถอยหลัง state
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 นาที
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [expiryTime, setExpiryTime] = useState("");
  
  // ดึง QR Code จาก API โดยใช้ token จาก localStorage
  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        setQrLoading(true);
        // ใช้ finalPrice จาก bookingData หรือค่าเริ่มต้น 49
        const amount = finalPrice || 49;
        
        // ดึง token จาก localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        }
        
        // เรียกใช้ API ด้วย axios และส่ง token ใน header
        const response = await axios.get(`https://backend.qseer.app/api/transaction/qr_promptpay?amount=${amount}`, {
          headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${token}`
          }
        });
        
        // กำหนด URL ของ QR code จาก response
        setQrCodeUrl(response.data);
        setQrLoading(false);
        
      } catch (error) {
        console.error("Error fetching QR code:", error);
        
        // จัดการกรณี token หมดอายุหรือไม่ถูกต้อง
        if (error.response && error.response.status === 401) {
          setQrError("Token หมดอายุหรือไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่");
          // อาจจะ redirect ไปหน้า login
          // setTimeout(() => navigate("/login"), 3000);
        } else {
          setQrError(error.message || "ไม่สามารถโหลด QR Code ได้");
        }
        
        setQrLoading(false);
      }
    };
    
    fetchQrCode();
    
    // คำนวณเวลาหมดอายุ
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    setExpiryTime(now.toLocaleString('th-TH', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));
    
  }, [finalPrice, navigate]);

  // แสดง Popup เพียง 1 วินาที
  useEffect(() => {
    if (isPopupOpen) {
      const timer = setTimeout(() => {
        setIsPopupOpen(false);
      }, 1000); // 1 วินาที
      return () => clearTimeout(timer);
    }
  }, [isPopupOpen]);
  
  // นับเวลาถอยหลัง
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // แปลงเวลาถอยหลังเป็น นาที : วินาที
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} นาที ${secs} วินาที`;
  };
  
  // ฟังก์ชันบันทึก QR Code
  const handleSaveQR = () => {
    // ในสภาพแวดล้อมจริง อาจจะใช้ canvas-to-blob หรือ html-to-image libraries
    // แต่ในที่นี้เราจะแค่แสดง popup
    setIsPopupOpen(true);
  };

  // ฟังก์ชันเมื่อคลิกปุ่มตกลง
  const handleConfirm = () => {
    navigate("/bookingSeer4", { state: bookingData });
  };

  // ฟังก์ชันกลับไปหน้า login
  const handleReturnToLogin = () => {
    navigate("/login");
  };

  // แสดง Loading
  if (qrLoading) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
          <Navbar />
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#65558F]"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด QR Code...</p>
        </div>
      </>
    );
  }

  // แสดง Error
  if (qrError) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
          <Navbar />
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="bg-red-50 p-6 rounded-lg max-w-md">
            <h3 className="text-red-700 font-medium text-lg">เกิดข้อผิดพลาด</h3>
            <p className="text-red-600 mt-2">{qrError}</p>
            {qrError.includes("token") ? (
              <button 
                className="mt-4 bg-[#65558F] text-white px-4 py-2 rounded-md"
                onClick={handleReturnToLogin}
              >
                กลับไปหน้าเข้าสู่ระบบ
              </button>
            ) : (
              <button 
                className="mt-4 bg-[#65558F] text-white px-4 py-2 rounded-md"
                onClick={() => window.location.reload()}
              >
                ลองใหม่
              </button>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>
      <div className="flex flex-col items-center p-6 mt-16">
        {/* กล่องข้อมูลการชำระเงิน */}
        <div className="border rounded-lg p-6 shadow-md bg-white max-w-lg w-full">
          {/* แสดงยอดชำระ */}
          <div className="flex justify-between text-lg font-semibold">
            <span>ยอดชำระเงิน</span>
            <span>{finalPrice || 49.00} บาท</span>
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
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR Code" className="w-60 mt-2" />
            ) : (
              <img src={Images.qr} alt="QR Code" className="w-60 mt-2" />
            )}
            <p className="text-lg font-semibold mt-2 text-[#65558F]">{finalPrice || 49.00} บาท</p>
            <p className="text-gray-600 text-sm">บัญชี: นางสาวสุรางคนางค์ เกตุยั่งยืนวงศ์ </p>
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
            className="px-12 py-4 rounded-lg font-semibold text-white bg-[#8677A7] hover:bg-[#564477] text-lg transition"
            onClick={handleConfirm}
          >
            ตกลง
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

        {/* Popup Modal */}
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

export default BookingSeer3;