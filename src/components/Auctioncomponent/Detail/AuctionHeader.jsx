import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../../assets"; 
import AuctionPopup from "./AuctionPopup";
import axios from "axios";

const AuctionHeader = ({ auction, onBack }) => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userHasJoinedAuction, setUserHasJoinedAuction] = useState(false);
  const [userCoins, setUserCoins] = useState(0);
  const [loading, setLoading] = useState(false);

  // API Base URL
  const API_BASE_URL = 'https://backend.qseer.app';

  // ตรวจสอบว่า auction มีค่าหรือไม่
  if (!auction) return null;

  // ดึงข้อมูลผู้ใช้ปัจจุบันและตรวจสอบว่าเคยเข้าร่วมประมูลหรือไม่
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!auction.id) return;
      
      setLoading(true);
      try {
        // ดึงข้อมูลผู้ใช้เพื่อตรวจสอบ coins
        const userResponse = await axios.get(`${API_BASE_URL}/api/user/me`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Accept': 'application/json'
          },
          withCredentials: true
        });
        
        if (userResponse.data && userResponse.data.coins !== undefined) {
          setUserCoins(userResponse.data.coins);
          
          // ใช้ API endpoint ใหม่เพื่อตรวจสอบว่าผู้ใช้เคยเข้าร่วมประมูลหรือไม่
          try {
            const myBidResponse = await axios.get(`${API_BASE_URL}/api/auction/${auction.id}/bids/me`, {
              headers: {
                'Cache-Control': 'no-cache',
                'Accept': 'application/json'
              },
              withCredentials: true
            });
            
            // ตรวจสอบว่ามีการบิดและจำนวนเงินบิดมากกว่า 0
            if (myBidResponse.data && myBidResponse.data.amount > 0) {
              setUserHasJoinedAuction(true);
            } else {
              setUserHasJoinedAuction(false);
            }
          } catch (bidErr) {
            // ถ้ามี error จาก API (เช่น 404 หรือ 401) แสดงว่าผู้ใช้ยังไม่เคยเข้าร่วมประมูล
            console.log("User has not joined this auction yet:", bidErr);
            setUserHasJoinedAuction(false);
          }
        }
      } catch (err) {
        console.error("Error checking user status:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserStatus();
  }, [auction.id]);

  // สร้างฟังก์ชันสำหรับการกลับไปหน้าก่อนหน้า
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // ฟังก์ชันเมื่อกดปุ่มเข้าร่วมประมูล หรือ ไปหน้าประมูล
  const handleAuctionAction = () => {
    // ถ้าเคยเข้าร่วมประมูลแล้ว ไปที่หน้าประมูลได้เลย
    if (userHasJoinedAuction) {
      navigate(`/bidAuction/${auction.id}`, {
        state: {
          auction_id: auction.id,
          initialBid: auction.initialBid,
          minIncrement: auction.minIncrement,
          auctioneerName: auction.astrologer.name
        }
      });
    } else {
      // ถ้ายังไม่เคยเข้าร่วม ให้เปิด popup
      setIsPopupOpen(true);
    }
  };

  return (
    <div className="relative w-full bg-[#8677A7] text-white p-6 rounded-lg">
      {/* ปุ่มย้อนกลับ */}
      <button 
        onClick={handleBack} 
        className="absolute top-4 left-4 flex items-center text-gray-600 text-sm px-3 py-1 bg-gray-200 rounded-full"
      >
        <img src={Images.backtoback} alt="Back" className="w-2 h-3 mr-2" />
        <span>ย้อนกลับ</span>
      </button>

      {/* คอนเทนเนอร์หลัก */}
      <div className="flex flex-col md:flex-row gap-0 items-stretch p-7">
        {/* รูปภาพประมูล (เต็มขนาดของการ์ด) */}
        <div className="w-full md:w-1/2">
          <img 
            src={auction.image || Images.auctionImages} 
            alt={auction.title} 
            className="w-full h-full object-cover rounded-t-lg md:rounded-t-none md:rounded-l-lg" 
          />
        </div>

        {/* ข้อมูลหลัก */}
        <div className="w-full md:w-1/2 bg-white text-gray-800 p-6 rounded-b-lg md:rounded-b-none md:rounded-r-lg flex flex-col justify-between shadow-md">
          {/* สถานะ + ปุ่มแชร์ */}
          <div className="flex justify-between items-center">
            <span className="bg-green-200 text-green-700 text-xs px-3 py-1 rounded-full">กำลังประมูล</span>
            <button className="text-gray-500">
              <img src={Images.share} alt="Share" className="w-5 h-5" />
            </button>
          </div>

          {/* ข้อมูลประมูล */}
          <h1 className="text-lg font-bold mt-2 text-gray-900">{auction.title}</h1>
          <p className="text-sm text-gray-600">{auction.shortDescription || auction.description}</p>
          <p className="text-lg font-semibold text-purple-700 mt-2">
            ราคาเริ่มต้น <span className="text-[#5A189A]">{auction.initialBid || 50} Coins</span>
          </p>

          {/* หมอดู */}
          <div className="flex items-center mt-2">
            <img 
              src={auction.astrologer?.image || Images.profileSmall} 
              alt={auction.astrologer?.name || "หมอดู"} 
              className="w-8 h-8 rounded-full" 
            />
            <p className="ml-2 text-sm font-medium">
              {auction.astrologer?.name || "ไม่ระบุชื่อหมอดู"}
            </p>
          </div>

          {/* ปุ่มร่วมประมูล หรือ ไปหน้าประมูล */}
          <button
            className={`mt-4 ${userHasJoinedAuction ? 'bg-green-600 hover:bg-green-700' : 'bg-[#8677A7] hover:bg-[#77599A]'} text-white py-1.5 px-6 rounded-full w-full text-sm font-medium shadow-md transition`}
            onClick={handleAuctionAction}
            disabled={loading}
          >
            {loading ? 'กำลังตรวจสอบ...' : userHasJoinedAuction ? 'ไปหน้าประมูล' : 'เข้าร่วมประมูล'}
          </button>
          
          {/* แสดงข้อความเตือนถ้า coins ไม่พอ และยังไม่เคยเข้าร่วม */}
          {!userHasJoinedAuction && userCoins < auction.initialBid && !loading && (
            <p className="text-xs text-red-600 mt-1 text-center">
              *Coins ไม่เพียงพอ คุณมี {userCoins} Coins จากขั้นต่ำ {auction.initialBid} Coins
            </p>
          )}
        </div>
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

export default AuctionHeader;