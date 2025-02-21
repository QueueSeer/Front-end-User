import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Images from "../../../assets"; // ✅ ใช้ Images จาก assets

const Queuedetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);

  const auctionData = {
    confirmationCode: "4QCFR",
    paymentDate: "09 กันยายน 2567, 13.45 น.",
    price: "10,000 คอยน์",
    appointmentDate: "10 กันยายน 2567",
    appointmentTime: "13.30 น.",
    status: "รอเข้ารับบริการ",
    seerName: "หมอดู เพียงฟ้า พงษ์พิช",
    contact: "thrthrthjrtjrjyjv",
    user: {
      name: "จารุวรรณ เกตุอ่อนงาม",
      gender: "เพศหญิง",
      birthDate: "8 เมษายน 2546",
      birthTime: "03.45 น.",
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(auctionData.confirmationCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col ">
      {/* ปุ่มย้อนกลับ */}
      <button
        className="flex items-center text-gray-700 mb-6 self-start border px-4 py-2 rounded-full"
        onClick={() => navigate(-1)}
      >
        <img src={Images.Arrowleft} alt="Arrowleft" className="w-5 h-5 mr-2" />
        ย้อนกลับ
      </button>

      {/* ส่วนหลัก */}
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-5xl text-center">
        <h2 className="text-green-700 text-3xl font-bold">
          ยินดีด้วย! คุณได้จองคิวเรียบร้อย
        </h2>

        {/* รหัสยืนยันคิว */}
        <div className="flex justify-center items-center mt-4 text-xl font-semibold">
          รหัสยืนยันคิว คือ{" "}
          <span className="text-purple-700 text-2xl ml-2">
            {auctionData.confirmationCode}
          </span>
          <button onClick={copyToClipboard} className="ml-2">
            <img
              src={Images.Copy}
              alt="Copy Code"
              className="w-5 cursor-pointer"
            />
          </button>
        </div>
        {isCopied && <p className="text-sm text-gray-500 mt-1">คัดลอกแล้ว!</p>}

        {/* ข้อมูลการชำระเงิน */}
        <div className="mt-6 border border-green-400 rounded-md p-4 text-center text-gray-700">
          <p>
            ชำระผ่าน <b>โอนคอยน์</b> วันที่ <b>{auctionData.paymentDate}</b>{" "}
            จำนวนราคา <b>{auctionData.price}</b>
          </p>
        </div>

        {/* กล่องข้อมูลหลัก */}
        <div className="mt-8 flex gap-8 items-start">
          {/* กล่องซ้าย */}
          <div className="flex-[1.4] bg-[#7B5EA7] text-white p-8 rounded-lg shadow-md text-left">
            <div className="flex justify-between text-sm mt-1">
              <div>
                <p className="opacity-80">วันที่นัดหมาย</p>
                <p className="text-lg font-semibold">
                  {auctionData.appointmentDate}
                </p>
              </div>
              <div>
                <p className="opacity-80">เวลานัดหมาย</p>
                <p className="text-lg font-semibold">
                  {auctionData.appointmentTime}
                </p>
              </div>
              <div>
                <p className="opacity-80 mb-1">สถานะ</p>
                <span className="bg-white text-purple-700 px-4 py-1 rounded-full text-sm font-medium ">
                  {auctionData.status}
                </span>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-xl font-bold">เเพคเกจดูดวงรายเดือน</p>
              <p className="opacity-80 text-sm mt-1">{auctionData.seerName}</p>
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

        {/* รายละเอียดการประมูล */}
        <div className="mt-12 text-left">
          <h3 className="text-lg font-bold mb-4">รายละเอียดการดูดวง</h3>
          <div className="flex gap-6 bg-white  p-6 pl-2 ">
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
  );
};

export default Queuedetails;
