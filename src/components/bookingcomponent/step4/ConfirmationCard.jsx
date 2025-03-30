import React, { useEffect, useState } from "react";

import Images from "../../../assets";

const ConfirmationCard = ({ bookingData = {}, user_fullname }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // สำหรับการ debug
  useEffect(() => {
    console.log("ConfirmationCard received data:", bookingData,user_fullname);
  }, [bookingData]);

  // สร้างรหัสการจองแบบสุ่ม (ในกรณีที่ไม่มีข้อมูล bookingId)
  const bookingCode = bookingData.code;

  // จัดรูปแบบวันที่และเวลา
  const formatDatetime = () => {
    if (!bookingData.start_time) return "25/02/68 10:45 น.";
    
    const date = new Date(bookingData.start_time);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear() + 543).slice(-2); // แปลงเป็นปี พ.ศ. และเอา 2 ตัวท้าย
    
    const time = bookingData.start_time.split('T')[1].split(':');
    
    
    return `${day}/${month}/${year} ${time[0]}:${time[1]} น.`;
  };

  // ฟังก์ชันคัดลอกโค้ด
  const copyCode = () => {
    navigator.clipboard.writeText(bookingCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  };

  // ฟังก์ชันแสดง Popup บันทึกภาพ
  const saveImage = () => {
    setIsPopupOpen(true);
    setTimeout(() => setIsPopupOpen(false), 1000);
  };

  // ตรวจสอบการแจ้งเตือน - คำนึงถึงทุกกรณีที่เป็นไปได้
  const getNotification = () => {
    // กรณีที่มีค่า notification โดยตรง
    if (bookingData.notification === true) {
      return bookingData.userInfo?.email || "2552598@gmail.com";
    }
    // กรณีที่ notifyByEmail อยู่ใน userInfo
    if (bookingData.userInfo?.notifyByEmail === true) {
      return bookingData.userInfo.email || "2552598@gmail.com";
    }
    // กรณีที่ userInfo.email มีค่าแต่ notification เป็น false
    return "ไม่รับการแจ้งเตือน";
  };

  return (
    <div className="bg-[#E4E4E6] p-8 rounded-xl shadow-md max-w-lg w-full text-center relative">
      {/* ไอคอนเช็คถูก */}
      <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-[#E4E4E6] rounded-full p-4">
        <img src={Images.tickcircle} alt="Success" className="w-14" />
      </div>

      {/* ข้อความ */}
      <h2 className="text-xl font-bold mt-8">การจองคิวเสร็จสิ้น!</h2>
      <div className="flex justify-center items-center gap-2 mt-2">
        <p className="text-[#65558F] text-xl font-bold tracking-wide">{bookingCode}</p>
        <img 
          src={Images.Copy} 
          alt="Copy Code" 
          className="w-5 cursor-pointer" 
          onClick={copyCode}
        />
        {isCopied && <span className="text-sm text-gray-500">คัดลอกแล้ว!</span>}
      </div>

      <hr className="my-4 border-gray-300" />

      {/* รายละเอียด */}
      <div className="text-sm text-gray-700 text-left px-6">
        <div className="grid grid-cols-2 gap-y-3">
          <p className="font-medium">ชื่อหมอดู</p>
          <p>{bookingData.seer_display_name}</p>

          <p className="font-medium">แพ็กเกจ</p>
          <p>{bookingData.package_name}</p> 

          <p className="font-medium">ชื่อผู้จอง</p>
          <p>{user_fullname}</p>

          <p className="font-medium">วันเวลาที่จอง</p>
          <p>{formatDatetime()}</p>

          <p className="font-medium">ช่องทางการติดต่อหมอดู</p>
          <form action={bookingData.seer_socials_link} target="_blank">
            <button className="text-[#65558F] underline cursor-pointer" type="submit">{bookingData.seer_socials_name}</button>
          </form>

          <p className="font-medium">รับการแจ้งเตือน</p>
          <p>{getNotification()}</p>
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      {/* ยอดรวม */}
      <p className="text-lg font-bold">
        ยอดรวม: <span className="text-black">{bookingData.total} บาท</span>
      </p>

      {/* ปุ่มบันทึกภาพ */}
      <button 
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg border font-semibold bg-white shadow-md text-[#65558F] mt-4"
        onClick={saveImage}
      >
        <img src={Images.importimages} alt="Save Image" className="w-5" />
        บันทึกภาพ
      </button>

      {/* Popup บันทึกภาพ */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <p className="text-lg font-semibold text-gray-800">บันทึกภาพแล้ว!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmationCard;