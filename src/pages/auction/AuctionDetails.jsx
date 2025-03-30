import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Images from "../../assets";
import Navbar from "../../components/navbar";

const AuctionDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auction_id } = useParams();
  const [isCopied, setIsCopied] = useState(false);
  const [auctionData, setAuctionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API Base URL
  const API_BASE_URL = 'https://backend.qseer.app/api';

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      if (!auction_id) {
        setError("ไม่พบรหัสการประมูล");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/auction/${auction_id}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Accept': 'application/json'
          },
          withCredentials: true
        });
        
        // เตรียมข้อมูลสำหรับแสดงผล
        setAuctionData({
          // ข้อมูลจาก API
          id: response.data.id,
          name: response.data.name,
          shortDescription: response.data.short_description,
          description: response.data.description,
          image: response.data.image,
          startTime: response.data.start_time,
          endTime: response.data.end_time,
          appointStartTime: response.data.appoint_start_time,
          appointEndTime: response.data.appoint_end_time,
          initialBid: response.data.initial_bid,
          minIncrement: response.data.min_increment,
          dateCreated: response.data.date_created,
          
          // ข้อมูลหมอดู
          seerName: response.data.seer?.display_name || "หมอดู เพียงฟ้า พาขวัญ",
          seerImage: response.data.seer?.image,
          seerId: response.data.seer?.id,
          
          // ข้อมูลสำหรับแสดงในหน้ารายละเอียด
          confirmationCode: generateConfirmationCode(response.data.id),
          paymentDate: formatDateTime(new Date()),
          price: `${response.data.initial_bid} คอยน์`,
          appointmentDate: formatDate(response.data.appoint_start_time),
          appointmentTime: formatTime(response.data.appoint_start_time),
          status: "รอเข้ารับบริการ",
          contact: response.data.seer?.contact || "thrthrthjrtjrjyjv",
          
          // ข้อมูลผู้ใช้ (จะดึงจาก API ต่างหาก หรือใช้ตัวอย่าง)
          user: {
            name: "สุรางคนางค์ เกตุยั่งยืนวงศ์",
            gender: "เพศหญิง",
            birthDate: "8 เมษายน 2546",
            birthTime: "08.45 น.",
            email: "255298@gmail.com",
            connectionType: "อีเมล",
          },
          
          // รายละเอียดประมูล
          details: response.data.description || `
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
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching auction details:", err);
        setError("ไม่สามารถดึงข้อมูลรายละเอียดการประมูลได้");
        setLoading(false);
      }
    };

    fetchAuctionDetails();
  }, [auction_id]);

  // ฟังก์ชันสร้างรหัสยืนยัน
  const generateConfirmationCode = (id) => {
    // ตัวอย่างการสร้างรหัสยืนยันจาก id
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const idStr = id?.toString() || '';
    let code = '';
    
    // ใช้ id เป็นต้นแบบและสุ่มตัวอักษรเพิ่มเติม
    for (let i = 0; i < 5; i++) {
      const charIndex = (i < idStr.length) 
        ? (parseInt(idStr[i]) || 0) % 36 
        : Math.floor(Math.random() * 36);
      code += characters[charIndex];
    }
    
    return code;
  };

  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุ";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "ไม่ระบุ";
      
      const day = date.getDate();
      const monthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
      
      return `${day} ${month} ${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "ไม่ระบุ";
    }
  };

  // ฟังก์ชันจัดรูปแบบเวลา
  const formatTime = (dateString) => {
    if (!dateString) return "ไม่ระบุ";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "ไม่ระบุ";
      
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${hours}.${minutes} น.`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "ไม่ระบุ";
    }
  };

  // ฟังก์ชันจัดรูปแบบวันที่และเวลา
  const formatDateTime = (date) => {
    if (!date) return "ไม่ระบุ";
    
    try {
      if (isNaN(date.getTime())) return "ไม่ระบุ";
      
      const day = date.getDate();
      const monthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day} ${month} ${year}, ${hours}.${minutes} น.`;
    } catch (error) {
      console.error("Error formatting date time:", error);
      return "ไม่ระบุ";
    }
  };

  const copyToClipboard = () => {
    if (auctionData?.confirmationCode) {
      navigator.clipboard.writeText(auctionData.confirmationCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
          <Navbar />
        </div>
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center pt-24">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
          <p className="mt-4 text-lg text-purple-700">กำลังโหลดข้อมูล...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
          <Navbar />
        </div>
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center pt-24">
          <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
            <h2 className="text-red-600 text-xl font-bold mb-4">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => navigate("/homepage")}
              className="px-5 py-3 bg-purple-600 text-white rounded-lg"
            >
              กลับไปหน้าแรก
            </button>
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

      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center pt-24">
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
          <h2 className="text-green-700 text-3xl font-bold">ยินดีด้วย! คุณได้จองคิวเรียบร้อย</h2>

          {/* รหัสยืนยันคิว */}
          <div className="flex justify-center items-center mt-4 text-xl font-semibold">
            รหัสยืนยันคิว คือ <span className="text-purple-700 text-2xl ml-2">{auctionData?.confirmationCode}</span>
            <button onClick={copyToClipboard} className="ml-2">
              <img src={Images.Copy} alt="Copy Code" className="w-5 cursor-pointer" />
            </button>
          </div>
          {isCopied && <p className="text-sm text-gray-500 mt-1">คัดลอกแล้ว!</p>}

          {/* ข้อมูลการชำระเงิน */}
          <div className="mt-6 border border-green-400 rounded-md p-4 text-center text-gray-700">
            <p>
              ชำระผ่าน <b>โชคคอยน์</b> วันที่ <b>{auctionData?.paymentDate}</b> จำนวนราคา{" "}
              <b>{auctionData?.price}</b>
            </p>
          </div>

          {/* กล่องข้อมูลหลัก */}
          <div className="mt-8 flex gap-8 items-start">
            {/* กล่องซ้าย */}
            <div className="flex-[1.4] bg-[#7B5EA7] text-white p-8 rounded-lg shadow-md text-left">
              <div className="flex justify-between text-sm mt-1">
                <div>
                  <p className="opacity-80">วันที่นัดหมาย</p>
                  <p className="text-lg font-semibold">{auctionData?.appointmentDate}</p>
                </div>
                <div>
                  <p className="opacity-80">เวลานัดหมาย</p>
                  <p className="text-lg font-semibold">{auctionData?.appointmentTime}</p>
                </div>
                <div>
                  <p className="opacity-80 mb-1">สถานะ</p>
                  <span className="bg-white text-purple-700 px-4 py-1 rounded-full text-sm font-medium">
                    {auctionData?.status}
                  </span>
                </div>
              </div>

              <div className="text-center mt-8">
                <p className="text-xl font-bold">{auctionData?.name || "ประมูลดูดวงออนไลน์"}</p>
                <p className="opacity-80 text-sm mt-1">{auctionData?.seerName}</p>
              </div>

              <div className="text-center mt-8">
                <p className="text-sm opacity-80 inline">ช่องทางติดต่อ: </p>
                <span 
                  className="text-white font-semibold underline cursor-pointer"
                  onClick={() => window.open(`https://${auctionData?.contact}`, "_blank")}>
                  {auctionData?.contact}
                </span>
              </div>
            </div>

            {/* กล่องขวา */}
            <div className="flex-1 border border-gray-300 p-6 rounded-lg shadow-md bg-white text-left min-h-[240px]">
              <h3 className="text-lg font-bold mb-4">ข้อมูลผู้จอง</h3>

              {/* ใช้ flex ให้หัวข้อและค่าตรงกัน */}
              <div className="grid grid-cols-2 gap-y-1">
                <p className="font-semibold text-gray-700">ชื่อ-นามสกุล:</p>
                <p>{auctionData?.user.name}</p>

                <p className="font-semibold text-gray-700">สถานะ:</p>
                <p>{auctionData?.user.gender}</p>

                <p className="font-semibold text-gray-700">วันเดือนปีเกิด:</p>
                <p>{auctionData?.user.birthDate}</p>

                <p className="font-semibold text-gray-700">เวลาเกิด:</p>
                <p>{auctionData?.user.birthTime}</p>

                <p className="font-semibold text-gray-700">อีเมล:</p>
                <p>{auctionData?.user.email}</p>

                <p className="font-semibold text-gray-700">แจ้งเตือนผ่าน:</p>
                <p>{auctionData?.user.connectionType}</p>
              </div>
            </div>
          </div>
          <div className="w-70 h-[2px] bg-gray-200 mx-auto my-4 mt-8"></div>

          {/* รายละเอียดการประมูล */}
          <div className="mt-12 text-left">
            <h3 className="text-lg font-bold mb-4">รายละเอียดประมูลดูดวงออนไลน์</h3>
            <div className="flex gap-6 bg-white p-6 pl-2">
              <img 
                src={auctionData?.image || Images.tarotImages} 
                alt="Tarot Reading" 
                className="w-2/3 rounded-lg shadow"
                onError={(e) => {
                  e.target.src = Images.tarotImages;
                }}
              />
              <p className="text-gray-700 whitespace-pre-line">{auctionData?.details}</p>
            </div>
          </div>

          {/* ปุ่มย้อนกลับ */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/homepage")}
              className="px-5 py-3 bg-green-600 text-white rounded-lg text-lg"
            >
              กลับไปหน้าแรก
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionDetails;