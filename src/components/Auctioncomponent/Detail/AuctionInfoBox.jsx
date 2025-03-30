import React, { useState, useEffect } from "react";
import Images from "../../../assets"; // ใช้รูปแทนไอคอนจาก assets
import axios from "axios";

const AuctionInfoBox = ({ auction }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [bidderCount, setBidderCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userHasJoinedAuction, setUserHasJoinedAuction] = useState(false);
  const [userCoins, setUserCoins] = useState(0);

  // API Base URL
  const API_BASE_URL = 'https://backend.qseer.app';

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

  // ดึงข้อมูลจำนวนผู้ประมูลและตรวจสอบว่าผู้ใช้ปัจจุบันเคยเข้าร่วมประมูลหรือไม่
  useEffect(() => {
    if (!auction || !auction.id) return;
    
    const fetchBiddersAndCheckUser = async () => {
      setLoading(true);
      try {
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
        
        // นับจำนวนผู้ประมูลที่มีการลงเงิน (amount > 0)
        const activeBidders = bidsArray.filter(bid => bid.amount > 0);
        setBidderCount(activeBidders.length);
        
        // ดึงข้อมูลผู้ใช้ปัจจุบันเพื่อตรวจสอบว่าเคยเข้าร่วมประมูลหรือไม่
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
        console.error("Error fetching bidders or user info:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBiddersAndCheckUser();
  }, [auction]);

  return (
    <div className="mb-6">
      {/* แสดงสถานะการเข้าร่วมประมูลของผู้ใช้ (ถ้าเคยเข้าร่วมแล้ว) */}
      {userHasJoinedAuction && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded mb-4 text-center">
          คุณเคยเข้าร่วมประมูลแล้ว สามารถเข้าสู่หน้าประมูลได้ทันที
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
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
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin h-5 w-5 mr-2 border-2 border-purple-500 rounded-full border-t-transparent"></div>
                <span>กำลังโหลด</span>
              </div>
            ) : (
              <p className="text-xl font-bold text-black">{bidderCount} คน</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionInfoBox;