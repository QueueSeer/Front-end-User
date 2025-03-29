import React, { useState, useEffect } from "react";
import Images from "../../../assets"; // ใช้รูปแทนไอคอนจาก assets

const AuctionInfoBox = ({ auction }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [bidderCount, setBidderCount] = useState(0);

  // คำนวณเวลาที่เหลือ
  useEffect(() => {
    if (!auction || !auction.endDate) return;

    // แปลงวันที่สิ้นสุดเป็น timestamp
    const endTime = new Date(auction.originalData?.end_time || auction.endDate).getTime();
    
    // ฟังก์ชันอัปเดตเวลาที่เหลือ
    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = endTime - now;
      
      // เมื่อหมดเวลา
      if (distance < 0) {
        setTimeLeft("หมดเวลาแล้ว");
        return;
      }
      
      // คำนวณวัน ชั่วโมง นาที วินาที
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // จัดรูปแบบเวลาที่เหลือ
      setTimeLeft({
        days,
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    };
    
    // อัปเดตครั้งแรก
    updateTimeLeft();
    
    // ตั้งเวลาอัปเดตทุกวินาที
    const interval = setInterval(updateTimeLeft, 1000);
    
    // เคลียร์ interval เมื่อ unmount
    return () => clearInterval(interval);
  }, [auction]);

// คำนวณเวลาที่เหลือ
useEffect(() => {
  if (!auction || !auction.startDate || !auction.endDate) return;

  // แปลงวันที่เริ่มและสิ้นสุดเป็น timestamp
  const startTime = new Date(auction.originalData?.start_time || auction.startDate).getTime();
  const endTime = new Date(auction.originalData?.end_time || auction.endDate).getTime();
  
  // ฟังก์ชันอัปเดตเวลาที่เหลือ
  const updateTimeLeft = () => {
    const now = new Date().getTime();
    
    // ตรวจสอบว่าถึงเวลาเริ่มประมูลหรือยัง
    if (now < startTime) {
      setTimeLeft("ยังไม่ถึงเวลาประมูล");
      return;
    }
    
    // ตรวจสอบว่าสิ้นสุดการประมูลหรือยัง
    const distance = endTime - now;
    if (distance < 0) {
      setTimeLeft("หมดเวลาแล้ว");
      return;
    }
    
    // คำนวณวัน ชั่วโมง นาที วินาที
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // จัดรูปแบบเวลาที่เหลือ
    setTimeLeft({
      days,
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    });
  };
  
  // อัปเดตครั้งแรก
  updateTimeLeft();
  
  // ตั้งเวลาอัปเดตทุกวินาที
  const interval = setInterval(updateTimeLeft, 1000);
  
  // เคลียร์ interval เมื่อ unmount
  return () => clearInterval(interval);
}, [auction]);

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {/* เวลาที่เหลือ */}
      <div className="flex items-center gap-3 border rounded-lg p-4 shadow-sm">
        <img src={Images.ClockCircle} alt="Clock" className="w-8 h-8 text-purple-700" />
        <div>
          <p className="text-gray-600 text-sm">เวลาคงเหลือ</p>
          {typeof timeLeft === 'string' ? (
            <p className="text-xl font-bold text-black">{timeLeft}</p>
          ) : (
            <p className="text-xl font-bold">
              <span className="text-black">{timeLeft?.days || 0} วัน</span>{' '}
              <span className="text-gray-800">
                {timeLeft?.hours || '00'}:{timeLeft?.minutes || '00'}:{timeLeft?.seconds || '00'}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* จำนวนผู้ประมูล */}
      <div className="flex items-center gap-3 border rounded-lg p-4 shadow-sm">
        <img src={Images.Sledgehammer} alt="Sledgehammer" className="w-8 h-8 text-purple-700" />
        <div>
          <p className="text-gray-600 text-sm">จำนวนผู้ประมูล</p>
          <p className="text-xl font-bold text-black">{bidderCount} คน</p>
        </div>
      </div>
    </div>
  );
};

export default AuctionInfoBox;