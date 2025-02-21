import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BookingSeer3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const receivedPrice = location.state?.finalPrice ?? null; // ป้องกัน undefined

  const [finalPrice, setFinalPrice] = useState(receivedPrice);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loadingQr, setLoadingQr] = useState(true);
  const [errorQr, setErrorQr] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  console.log(" location.state:", location.state);
  console.log(" finalPrice received:", receivedPrice);
  console.log(" finalPrice used:", finalPrice);

  //  ดึง Token จาก LocalStorage
  const API_TOKEN = localStorage.getItem("token");

  //  ถ้าไม่มี Token ให้ Redirect ไป Login
  useEffect(() => {
    if (!API_TOKEN) {
      console.warn(" ไม่มี Token กรุณา Login ก่อน");
      navigate("/login"); //  ส่งไปหน้า Login ถ้าไม่มี Token
    }
  }, [API_TOKEN, navigate]);

  //  ดึง QR Code จาก API เมื่อ finalPrice พร้อม
  useEffect(() => {
    if (!finalPrice || finalPrice <= 0) return; //  ป้องกันดึง API ถ้า finalPrice เป็น 0

    const fetchQrCode = async () => {
      try {
        setLoadingQr(true);
        console.log(`🚀 Fetching QR Code for amount: ${finalPrice}`);
    
        const response = await fetch(
          `https://backend.qseer.app/api/transaction/qr_promptpay?amount=${finalPrice}`,
          {
            method: "GET",
            credentials: "include", // 
            headers: {
              "Accept": "application/json",
            },
          }
        );
    
        if (response.status === 401) {
          console.error(" Token หมดอายุหรือไม่ถูกต้อง");
          navigate("/login"); // Redirect ไป Login ถ้า Token หมดอายุ
          return;
        }
    
        if (!response.ok) throw new Error(" ไม่สามารถโหลด QR Code ได้");
    
        const qrUrl = await response.text();
        console.log(" QR Code URL (Raw):", qrUrl);
    
        const decodedUrl = decodeURIComponent(qrUrl.trim()); // ป้องกัน Encoding Error
        setQrCodeUrl(`${decodedUrl}.png`); //  ใช้ URL ของ QR
    
        console.log("QR Code URL (Final):", `${decodedUrl}.png`);
      } catch (error) {
        console.error(" Error fetching QR Code:", error);
        setErrorQr(true);
      } finally {
        setLoadingQr(false);
      }
    };
    

    fetchQrCode();
  }, [finalPrice, API_TOKEN, navigate]);

  // ⏳ นับเวลาถอยหลัง
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  //  Popup หายไปเองใน 1 วินาที
  useEffect(() => {
    if (isPopupOpen) {
      const timer = setTimeout(() => {
        setIsPopupOpen(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPopupOpen]);

  //  แปลงเวลาถอยหลังเป็น นาที : วินาที
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} นาที ${secs} วินาที`;
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/*  กล่องข้อมูลการชำระเงิน */}
      <div className="border rounded-lg p-6 shadow-md bg-white max-w-lg w-full">
        {/*  แสดงยอดชำระ */}
        <div className="flex justify-between text-lg font-semibold">
          <span>ยอดชำระเงิน</span>
          <span>{finalPrice ? finalPrice.toFixed(2) : "กำลังโหลด"} บาท</span>
        </div>

        {/*  ระยะเวลาชำระเงิน */}
        <div className="flex justify-between text-lg mt-2">
          <span>กรุณาชำระภายใน</span>
          <span>{formatTime(timeLeft)}</span>
        </div>
        <div className="text-sm text-gray-700 text-right mt-2">
          <span>หมดเวลา 14 กันยายน 2567, 10.00 น.</span>
        </div>

        {/* 🔳 QR Code สำหรับชำระเงิน */}
        <div className="flex flex-col items-center mt-4">
          {loadingQr ? (
            <p className="text-gray-500">กำลังโหลด QR Code...</p>
          ) : errorQr ? (
            <p className="text-red-500"> ไม่สามารถโหลด QR Code ได้</p>
          ) : (
            <img src={qrCodeUrl} alt="QR Code" className="w-60 mt-2" />
          )}
          <p className="text-lg font-semibold mt-2 text-[#65558F]">
            {finalPrice ? finalPrice.toFixed(2) : "กำลังโหลด"} บาท
          </p>
        </div>
      </div>

      {/*  ปุ่มการกระทำ */}
      <div className="flex gap-6 mt-8">
        {/* ปุ่ม บันทึก QR */}
        <button
          className="px-12 py-4 rounded-lg border-2 border-[#8677A7] font-semibold text-[#65558F] text-lg bg-white hover:bg-[#F4F1FA] transition"
          onClick={() => setIsPopupOpen(true)}
        >
          บันทึก QR
        </button>

        {/* ปุ่ม ตกลง */}
        <button
          className="px-12 py-4 rounded-lg font-semibold text-white bg-[#8677A7] hover:bg-[#564477] text-lg transition"
          onClick={() => navigate("/bookingSeer4")}
        >
          ตกลง
        </button>
      </div>

      {/*  Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-center text-gray-800">
              บันทึก QR สำเร็จ
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSeer3;
