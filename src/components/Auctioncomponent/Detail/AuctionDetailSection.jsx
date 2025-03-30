import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../../assets";
import AuctionPopup from "./AuctionPopup";
import axios from "axios";

const AuctionDetailSection = ({ auction }) => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userHasJoinedAuction, setUserHasJoinedAuction] = useState(false);
  const [userCoins, setUserCoins] = useState(0);
  const [loading, setLoading] = useState(false);

  // API Base URL
  const API_BASE_URL = 'https://backend.qseer.app';

  // ตรวจสอบว่ามีข้อมูลหรือไม่
  if (!auction) return null;

  // ดึงข้อมูลผู้ใช้ปัจจุบันและตรวจสอบว่าเคยเข้าร่วมประมูลหรือไม่
  useEffect(() => {
    if (!auction || !auction.id) return;
    
    const checkUserStatus = async () => {
      setLoading(true);
      try {
        // ดึงข้อมูลผู้ใช้ปัจจุบัน
        const userResponse = await axios.get(`${API_BASE_URL}/api/user/me`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Accept': 'application/json'
          },
          withCredentials: true
        });
        
        if (userResponse.data && userResponse.data.id) {
          // เก็บจำนวน coins ของผู้ใช้
          setUserCoins(userResponse.data.coins || 0);
          
          // ดึงข้อมูลผู้ประมูลทั้งหมด
          const bidsResponse = await axios.get(`${API_BASE_URL}/api/auction/${auction.id}/bids`, {
            headers: {
              'Cache-Control': 'no-cache',
              'Accept': 'application/json'
            },
            withCredentials: true
          });
          
          // ตรวจสอบว่าข้อมูลอยู่ในรูปแบบอาร์เรย์หรือไม่
          let bidsArray = [];
          if (Array.isArray(bidsResponse.data)) {
            bidsArray = bidsResponse.data;
          } else if (bidsResponse.data && typeof bidsResponse.data === 'object') {
            // อาจจะมีการห่อหุ้มอาร์เรย์ไว้ในฟิลด์อื่น
            const possibleArrayFields = ['bids', 'items', 'data', 'results'];
            for (const field of possibleArrayFields) {
              if (Array.isArray(bidsResponse.data[field])) {
                bidsArray = bidsResponse.data[field];
                break;
              }
            }
          }
          
          // ค้นหาว่าผู้ใช้ปัจจุบันมีข้อมูลในรายการ bids หรือไม่
          const userBid = bidsArray.find(bid => bid.user_id === userResponse.data.id);
          
          // ถ้าพบและมีการลงเงิน (amount > 0) แสดงว่าเคยเข้าร่วมประมูลแล้ว
          if (userBid && userBid.amount > 0) {
            setUserHasJoinedAuction(true);
            console.log("User has already joined this auction");
          } else {
            setUserHasJoinedAuction(false);
            console.log("User has not joined this auction yet");
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserStatus();
  }, [auction]);

  // จัดรูปแบบข้อมูลเวลา
  const formatDateDisplay = (dateString) => {
    if (!dateString) return "ไม่ระบุ";
    
    try {
      // กรณีที่ dateString เป็นข้อความที่ถูกฟอร์แมตแล้ว
      if (typeof dateString === 'string' && !dateString.includes('T') && !dateString.endsWith('Z')) {
        return dateString; // ส่งคืนค่าเดิม
      }
      
      // แปลงเป็น Date object
      const date = new Date(dateString);
      
      // ตรวจสอบว่า date ถูกต้องหรือไม่
      if (isNaN(date.getTime())) {
        return dateString; // ถ้าแปลงไม่ได้ ส่งคืนค่าเดิม
      }
      
      // ดึงวันที่ เดือน ปี
      const day = date.getDate();
      const monthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];
      const month = monthNames[date.getMonth()];
      
      // แปลงปีเป็น พ.ศ.
      const year = date.getFullYear() + 543;
      
      // แปลงเวลาเป็นรูปแบบไทย
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `วันที่ ${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการแปลงวันที่:", error);
      return dateString; // ส่งคืนค่าเดิมถ้าเกิดข้อผิดพลาด
    }
  };
  
  // หมวดหมู่ดูดวง (สามารถดึงจาก API ถ้ามี หรือกำหนดเอง)
  const categories = ["ความรัก", "การงาน", "การเงิน", "สุขภาพ", "ภาพรวม"];

  // ฟังก์ชันเมื่อกดปุ่มเข้าร่วมประมูล หรือ ไปหน้าประมูล
  const handleAuctionAction = () => {
    // ถ้าเคยเข้าร่วมประมูลแล้ว ไปที่หน้าประมูลได้เลย
    if (userHasJoinedAuction) {
      navigate(`/bidAuction/${auction.id}`, {
        state: {
          auction_id: auction.id,
          initialBid: auction.initialBid,
          minIncrement: auction.minIncrement,
          auctioneerName: auction.astrologer?.name
        }
      });
    } else {
      // ถ้ายังไม่เคยเข้าร่วม ให้เปิด popup
      setIsPopupOpen(true);
    }
  };

  return (
    <div className="mt-4 text-gray-800 grid grid-cols-3 gap-6">
      {/* ส่วนข้อมูลรายละเอียด */}
      <div className="col-span-2">
        {/* สถานะ */}
        <div className="mb-6">
          <p className="text-lg font-bold border-l-4 border-[#8677A7] pl-3 ">สถานะ</p>
          <p className="text-lg mt-1">เปิดประมูล</p>
        </div>

        {/* ระยะเวลา */}
        <div className="mb-6">
          <p className="text-lg font-bold border-l-4 border-[#8677A7] pl-3">ระยะเวลา</p>
          <p className="text-gray-600 mt-1">
            เริ่มประมูล: {formatDateDisplay(auction.startDate)}
          </p>
          <p className="text-gray-600">
            สิ้นสุดประมูล: {formatDateDisplay(auction.endDate)}
          </p>
          {auction.appointStartTime && (
            <p className="text-gray-600">
              เวลานัดหมาย: {formatDateDisplay(auction.appointStartTime)}
              {auction.appointEndTime && ` - ${formatDateDisplay(auction.appointEndTime)}`}
            </p>
          )}
        </div>

        {/* หมวดหมู่ */}
        <div className="mb-6">
          <p className="text-lg font-bold border-l-4 border-[#8677A7] pl-3">หมวดหมู่</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((tag, index) => (
              <span 
                key={index} 
                className="bg-white border border-gray-400 text-[#420F75] text-sm px-4 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* รายละเอียด */}
        <div className="mt-6">
          <p className="text-lg font-bold border-l-4 border-[#8677A7] pl-3">รายละเอียด</p>
          {auction.description ? (
            <div className="mt-3 text-gray-900 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: auction.description }} />
            </div>
          ) : (
            <div className="mt-3 text-gray-900 leading-relaxed">
              <p>
                การประมูลแพ็กเกจดูดวงที่ครอบคลุมเรื่องความรัก สุขภาพ การงาน และการพยากรณ์ประจำปี 
                ถือเป็นโอกาสที่สำคัญสำหรับผู้ที่ต้องการศึกษาเส้นทางชีวิตของตนเองให้ลึกซึ้งขึ้น 
                โดยสามารถดูดวงเชิงลึกและวางแผนชีวิตได้
              </p>
              <ul className="mt-3 space-y-2 text-gray-900 list-disc list-inside">
                <li>
                  <strong>ความรัก:</strong> คุณจะได้รับการทำนายแนวโน้มในความสัมพันธ์ของคุณ ซึ่งจะช่วยให้คุณสามารถเข้าใจสถานการณ์และวางแผนชีวิตได้ดีขึ้น
                </li>
                <li>
                  <strong>สุขภาพ:</strong> การดูดวงสุขภาพช่วยให้คุณรู้จักระวังและป้องกันปัญหาสุขภาพล่วงหน้า
                </li>
                <li>
                  <strong>การงาน:</strong> คุณจะได้รับการชี้แนะแนวทางโอกาสความก้าวหน้าในอาชีพ หรือการลงทุนใหม่ 
                </li>
                <li>
                  <strong>ภาพรวมประจำปี:</strong> การดูดวงแนวโน้มของครึ่งปีหรือประจำปีช่วยให้คุณมองชีวิตอย่างเป็นระบบ
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* กล่องด้านขวา - Sticky Sidebar */}
      <div className="bg-white shadow-md p-4 rounded-lg border w-full max-w-xs self-start ml-auto relative sticky top-20">
        {/* บรรทัดเดียวกัน: สถานะ + ปุ่มแชร์ */}
        <div className="flex justify-between items-center">
          {/* สถานะ */}
          <span className="bg-green-200 text-green-700 text-xs px-2 py-1 rounded-full">
            กำลังประมูล
          </span>

          {/* ปุ่มแชร์ */}
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <img src={Images.share} alt="แชร์" className="w-5 h-5" />
          </button>
        </div>

        {/* ชื่อการประมูล */}
        <h3 className="text-md font-bold mt-2">{auction.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{auction.shortDescription}</p>

       
        
        {/* แสดงสถานะการเข้าร่วมประมูล */}
        {userHasJoinedAuction && (
          <div className="mt-2 text-xs text-green-600">
            คุณเคยเข้าร่วมประมูลนี้แล้ว สามารถเข้าสู่หน้าประมูลได้ทันที
          </div>
        )}

        {/* ปุ่มเข้าร่วมประมูล หรือ ไปหน้าประมูล */}
        <button
          className={`mt-4 ${
            userHasJoinedAuction 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-[#8677A7] hover:bg-[#77599A]'
          } text-white py-1.5 px-6 rounded-full w-full text-sm font-medium shadow-md transition`}
          onClick={handleAuctionAction}
          disabled={loading}
        >
          {loading 
            ? 'กำลังตรวจสอบ...' 
            : userHasJoinedAuction 
              ? 'ไปหน้าประมูล' 
              : 'เข้าร่วมประมูล'
          }
        </button>

        {/* แสดงข้อความเตือนถ้า coins ไม่พอ และยังไม่เคยเข้าร่วม */}
        {!userHasJoinedAuction && userCoins < auction.initialBid && !loading && (
          <p className="text-xs text-red-600 mt-1 text-center">
            *Coins ไม่เพียงพอ คุณมี {userCoins} Coins จากขั้นต่ำ {auction.initialBid} Coins
          </p>
        )}
      </div>

      {/* แสดง Popup เมื่อกด "เข้าร่วมประมูล" และยังไม่เคยเข้าร่วม */}
      {isPopupOpen && (
        <AuctionPopup 
          auction={auction} 
          onClose={() => setIsPopupOpen(false)}
          userCoins={userCoins}
          hasJoinedAuction={userHasJoinedAuction}
        />
      )}
    </div>
  );
};

export default AuctionDetailSection;