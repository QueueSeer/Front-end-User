import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Images from "../../../assets"; // ✅ ใช้ Images จาก assets
import Navbar from "../../../components/navbar";
import CopyButton from "../../../components/Button/CopyButton";
import BackButton from "../../../components/Button/BackButton";

// Component สำหรับ Modal ยกเลิกการจอง
const CancelConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#1C1B3A] flex items-center justify-center mb-4">
            <img 
              src={Images.crystalBall || "/crystal-ball.png"} 
              alt="Crystal Ball" 
              className="w-12 h-12"
            />
          </div>
          
          <h2 className="text-[#6E5D99] text-2xl font-bold mb-2">ยืนยันการยกเลิกหรือไม่ ?</h2>
          
          <p className="text-center text-gray-700 mb-2">คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคิวนี้?</p>
          <p className="text-center text-gray-700 mb-8">
            หากยกเลิกแล้ว คุณยังสามารถทำการจองใหม่ได้อีกในภายหลัง
            <br />โดยคุณสามารถยกเลิกได้อีก 2 / 3 ครั้ง
          </p>
          
          <div className="flex w-full gap-4">
            <button 
              onClick={onConfirm}
              className="flex-1 bg-[#6E5D99] text-white py-3 rounded-full font-medium hover:bg-[#5D4D82] transition-colors"
            >
              ยืนยัน
            </button>
            <button 
              onClick={onCancel}
              className="flex-1 border border-[#6E5D99] text-[#6E5D99] py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Queuedetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // สถานะสำหรับจัดการการคัดลอก
  const [copiedCode, setCopiedCode] = useState("");
  // สถานะสำหรับจัดการการยกเลิก
  const [isCanceled, setIsCanceled] = useState(false);
  // สถานะสำหรับจัดการการแสดง Modal
  const [showCancelModal, setShowCancelModal] = useState(false);

  const auctionData = {
    confirmationCode: "4QCFR",
    paymentDate: "24 กุมภาพันธ์ 2568, 13.45 น.",
    price: "49 คอยน์",
    appointmentDate: "25 กุมภาพันธ์ 2568",
    appointmentTime: "10.45 น.",
    status: "รอเข้ารับบริการ",
    canceledStatus: "บริการที่ถูกยกเลิก",
    seerName: "หมอดู เพียงฟ้า พาขวัญ",
    contact: "thrthrthjrtjrjyjv",
    user: {
      name: "สุรางคนางค์ เกตุยั่งยืนวงศ์",
      gender: "เพศหญิง",
      birthDate: "8 เมษายน 2546",
      birthTime: "08.45 น.",
      email: "255298@gmail.com",
      connectionType: "อีเมล",
    },
    description: `การประมูลพิเศษดูดวงหัวข้อครบถ้วน 
    ครอบคลุมเรื่องความรัก สุขภาพ การงาน และภาพรวมประจำปี`,
    details: `
      การประมูลแพ็กเกจดูดวงที่ครอบคลุมเรื่องความรัก สุขภาพ การงาน 
      และภาพรวมประจำปี ถือเป็นโอกาสที่ดีมากสำหรับผู้ที่ต้องการคำปรึกษา 
      และคำแนะนำเชิงลึกเกี่ยวกับชีวิตส่วนตัวในหลายๆ ด้าน ไม่ว่าจะเป็น:
      
      1. ความรัก: คุณจะได้รับการทำนายแนวโน้มความสัมพันธ์ของคุณ 
         ซึ่งจะช่วยให้คุณสามารถนำข้อคิดมาวิเคราะห์และพัฒนาชีวิตคู่ได้ดีขึ้น 
         รวมถึงทิศทางและสำหรับคนโสดจะช่วยให้คุณพบเจอคนที่เหมาะสม
         
      2. สุขภาพ: การดูดวงสุขภาพช่วยให้คุณรู้จักระมัดระวัง 
         และป้องกันปัญหาสุขภาพที่อาจเกิดขึ้นในปีนี้ พร้อมกับคำแนะนำในการดูแลสุขภาพให้แข็งแรงยิ่งขึ้น
      
      3. การงาน: คุณจะได้รับการทำนายเกี่ยวกับโอกาสความก้าวหน้า 
         การเปลี่ยนงาน หรือการลงทุนใหม่ ๆ
      
      4. การเงิน: แนะนำการบริหารเงินให้เหมาะสมกับสถานการณ์ปัจจุบันของคุณ 
         เพื่อให้คุณเตรียมรับมือกับปีใหม่ได้ดียิ่งขึ้น
    `,
  };

  // ฟังก์ชันสำหรับจัดการการคัดลอก
  const handleCopy = (code) => {
    setCopiedCode(code); // อัปเดตสถานะการคัดลอก
    setTimeout(() => setCopiedCode(""), 15000); // ล้างสถานะหลัง 15 วินาที
  };

  // ฟังก์ชันสำหรับเปิด Modal ยืนยันการยกเลิก
  const handleOpenCancelModal = () => {
    setShowCancelModal(true);
  };

  // ฟังก์ชันสำหรับปิด Modal ยกเลิก
  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
  };

  // ฟังก์ชันสำหรับยืนยันการยกเลิก
  const handleConfirmCancel = () => {
    setIsCanceled(true);
    setShowCancelModal(false);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col justify-center items-center">
        {/* ปุ่มย้อนกลับ */}
        <div className="pb-4 self-start">
          <BackButton />
        </div>
        
        {/* ส่วนหลัก */}
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-5xl text-center">
          <h2 className="text-3xl font-bold" style={{ color: isCanceled ? "#E74C3C" : "#2ECC71" }}>
            {isCanceled ? "การจองถูกยกเลิก" : "ยินดีด้วย! คุณได้จองคิวเรียบร้อย"}
          </h2>

          {/* รหัสยืนยันคิว - แสดงเฉพาะเมื่อยังไม่ยกเลิก */}
          {!isCanceled && (
            <div className="flex justify-center items-center mt-4 text-xl font-semibold">
              รหัสยืนยันคิว คือ{" "}
              <CopyButton
                text={auctionData.confirmationCode}
                isCopied={copiedCode === auctionData.confirmationCode}
                onCopy={() => handleCopy(auctionData.confirmationCode)}
                className="text-[24px]"
              />
            </div>
          )}

          {/* ข้อมูลการชำระเงิน */}
          <div className="mt-6 border border-green-400 rounded-md p-4 text-center text-gray-700">
            <p>
              ชำระผ่าน <b>โอนคอยน์</b> วันที่ <b>{auctionData.paymentDate}</b>{" "}
              จำนวนราคา <b>{auctionData.price}</b>
            </p>
            {isCanceled && (
              <p className="mt-2 text-red-500">
                คุณจะได้รับคอยน์คืนเต็มจำนวน 99 คอยน์ จากระบบภายในระยะเวลา 7 วัน
              </p>
            )}
          </div>

          {/* กล่องข้อมูลหลัก */}
          <div className="mt-8 flex gap-8 items-start">
            {/* กล่องซ้าย */}
            <div className="flex-[1.4] bg-[#7B5EA7] text-white p-8 rounded-lg shadow-md text-left">
              <div className="flex justify-between text-sm mt-1">
                <div>
                  <p className="opacity-80 text-center">วันที่นัดหมาย</p>
                  <p className="text-lg font-semibold">
                    {auctionData.appointmentDate}
                  </p>
                </div>
                <div>
                  <p className="opacity-80 text-center">เวลานัดหมาย</p>
                  <p className="text-lg font-semibold">
                    {auctionData.appointmentTime}
                  </p>
                </div>
                <div>
                  <p className="opacity-80 mb-2 text-center">สถานะ</p>
                  <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                    isCanceled 
                      ? "bg-red-100 text-red-600" 
                      : "bg-white text-purple-700"
                  }`}>
                    {isCanceled ? auctionData.canceledStatus : auctionData.status}
                  </span>
                </div>
              </div>

              <div className="text-center mt-8">
                <p className="text-xl font-bold">แพกเกจดูดวงรายเดือน</p>
                <p className="opacity-80 text-sm mt-1">
                  {auctionData.seerName}
                </p>
              </div>

              <div className="text-center mt-8">
                <p className="text-sm opacity-80 inline">ช่องทางติดต่อ: </p>
                <span
                  className="text-white font-semibold underline cursor-pointer"
                  onClick={() =>
                    window.open(`https://${auctionData.contact}`, "_blank")
                  }
                >
                  {auctionData.contact}
                </span>
              </div>
            </div>

            {/* กล่องขวา */}
            <div className="flex-1 border border-gray-300 p-6 rounded-lg shadow-md bg-white text-left min-h-[240px]">
              <h3 className="text-lg font-bold mb-4">ข้อมูลผู้จอง</h3>

              {/* ใช้ flex ให้หัวข้อและค่าตรงกัน */}
              <div className="grid grid-cols-2 gap-y-1">
                <p className="font-semibold text-gray-700">ชื่อ-นามสกุล:</p>
                <p>{auctionData.user.name}</p>

                <p className="font-semibold text-gray-700">สถานะ:</p>
                <p>{auctionData.user.gender}</p>

                <p className="font-semibold text-gray-700">วันเดือนปีเกิด:</p>
                <p>{auctionData.user.birthDate}</p>

                <p className="font-semibold text-gray-700">เวลาเกิด:</p>
                <p>{auctionData.user.birthTime}</p>

                <p className="font-semibold text-gray-700">อีเมล:</p>
                <p>{auctionData.user.email}</p>

                <p className="font-semibold text-gray-700">แจ้งเตือนผ่าน:</p>
                <p>{auctionData.user.connectionType}</p>
              </div>
            </div>
          </div>
          <div className="w-70 h-[2px] bg-gray-200 mx-auto my-4 mt-8"></div>

          {/* ปุ่มยกเลิก - แสดงเฉพาะเมื่อยังไม่ยกเลิก */}
          {!isCanceled && (
            <div className="mt-4 flex justify-center">
              <button 
                onClick={handleOpenCancelModal}
                className="px-6 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 transition-colors"
              >
                ยกเลิก (0/3)
              </button>
            </div>
          )}

          {!isCanceled && (
            <div className="mt-4 text-sm text-gray-500 max-w-3xl mx-auto">
              คุณสามารถยกเลิกคิวภายใน 24 ชั่วโมงได้ทั้งหมด 3 ครั้งต่อเดือน หากคุณยกเลิกครบ 3 ครั้ง โดยสิทธิ์ในการยกเลิกจะถูกรีเซ็ตทุกเดือน กรุณาตรวจสอบให้แน่ใจก่อนยืนยันการยกเลิก
            </div>
          )}

          {/* รายละเอียดการประมูล */}
          <div className="mt-12 text-left">
            <h3 className="text-lg font-bold mb-4">รายละเอียด</h3>
            <div className="flex gap-6 bg-white p-6 pl-2">
              <img
                src={Images.tarotImages}
                alt="Tarot Reading"
                className="w-2/3 rounded-lg shadow"
              />
              <p className="text-gray-700 whitespace-pre-line">
                {auctionData.details}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal ยืนยันการยกเลิก */}
      <CancelConfirmationModal 
        isOpen={showCancelModal}
        onConfirm={handleConfirmCancel}
        onCancel={handleCloseCancelModal}
      />
    </div>
  );
};

export default Queuedetails;