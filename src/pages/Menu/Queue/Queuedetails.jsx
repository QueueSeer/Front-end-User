import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Images from "../../../assets"; // ✅ ใช้ Images จาก assets
import Navbar from "../../../components/navbar";
import CopyButton from "../../../components/Button/CopyButton";
import BackButton from "../../../components/Button/BackButton";

const Queuedetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // สถานะสำหรับจัดการการคัดลอก
  const [copiedCode, setCopiedCode] = useState("");

  const auctionData = {
    confirmationCode: "4QCFR",
    paymentDate: "24 กุมภาพันธ์ 2568, 13.45 น.",
    price: "49 คอยน์",
    appointmentDate: "25 กุมภาพันธ์ 2568",
    appointmentTime: "10.45 น.",
    status: "รอเข้ารับบริการ",
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
          <h2 className="text-green-700 text-3xl font-bold">
            ยินดีด้วย! คุณได้จองคิวเรียบร้อย
          </h2>

          {/* รหัสยืนยันคิว */}
          <div className="flex justify-center items-center mt-4 text-xl font-semibold">
            รหัสยืนยันคิว คือ{" "}
            {/* <span className="text-purple-700 text-2xl ml-2">
              {auctionData.confirmationCode}
            </span> */}
            <CopyButton
              text={auctionData.confirmationCode}
              isCopied={copiedCode === auctionData.confirmationCode}
              onCopy={() => handleCopy(auctionData.confirmationCode)}
              className="text-[24px]"
            />
          </div>

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
                  <span className="bg-white text-purple-700 px-4 py-1 rounded-full text-sm font-medium ">
                    {auctionData.status}
                  </span>
                </div>
              </div>

              <div className="text-center mt-8">
                <p className="text-xl font-bold">ความรักในปีนี้เป็นอย่างไร </p>
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
    </div>
  );
};

export default Queuedetails;
