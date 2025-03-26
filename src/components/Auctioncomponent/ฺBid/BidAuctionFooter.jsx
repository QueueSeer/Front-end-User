import React, { useState, useEffect } from "react";
import Images from "../../../assets";
import { useNavigate, useParams } from "react-router-dom";
import LuckCard from "../../TopupComponent/LuckCard";
import axios from "axios"; // ต้องติดตั้ง axios ถ้ายังไม่ได้ติดตั้ง

const BidAuctionFooter = ({ selectedBidder, bidders, setBidders }) => {
  const navigate = useNavigate();
  const { auction_id } = useParams(); // รับ auction_id จาก URL parameters
  const [isExpanded, setIsExpanded] = useState(false);
  const [bidAmount, setBidAmount] = useState(50);
  const [userCoins, setUserCoins] = useState(85);
  const [bidderCoins, setBidderCoins] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAuctionInfo, setCurrentAuctionInfo] = useState({
    current_bid: 0,
    min_increment: 50,
    initial_bid: 50
  });

  // ฟังก์ชันดึงข้อมูลผู้ประมูลจาก API
  const fetchBidders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // ตรวจสอบว่าเรากำลังรันในโหมด development หรือไม่
      const baseUrl = import.meta.env.MODE === 'development' 
        ? 'http://localhost:5173' // หรือ URL ของ backend API ที่ถูกต้อง
        : '';
      
      const response = await axios.get(`${baseUrl}/api/auction/${auction_id}/bids`, {
        // เพิ่ม headers เพื่อป้องกันการ cache
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      // ตรวจสอบรูปแบบข้อมูลที่ได้รับจาก API
      console.log("API Response:", response.data);
      
      // ตรวจสอบว่า response.data เป็นอาร์เรย์หรือไม่
      let bidsArray = [];
      if (Array.isArray(response.data)) {
        bidsArray = response.data;
      } else if (response.data && typeof response.data === 'object') {
        // อาจจะมีการห่อหุ้มอาร์เรย์ไว้ในฟิลด์อื่น
        // ลองตรวจสอบฟิลด์ทั่วไปที่อาจใช้เก็บข้อมูลรายการ
        const possibleArrayFields = ['bids', 'items', 'data', 'results'];
        for (const field of possibleArrayFields) {
          if (Array.isArray(response.data[field])) {
            bidsArray = response.data[field];
            break;
          }
        }
        
        // ถ้ายังไม่พบอาร์เรย์ ใช้เป็นอาร์เรย์เปล่า
        if (bidsArray.length === 0) {
          console.warn("Response is not an array and no array field found:", response.data);
          // ถ้าเป็น status 304 (Not Modified) ให้ใช้ข้อมูลเดิม
          if (response.status === 304) {
            setIsLoading(false);
            return; // ใช้ข้อมูลเดิมที่ cache ไว้
          }
        }
      }
      
      // แปลงข้อมูลจาก API ให้เข้ากับโครงสร้างของ bidders ที่ใช้อยู่เดิม
      // เรียงลำดับข้อมูลตามจำนวน coins ก่อน (มากไปน้อย)
      const sortedBids = [...bidsArray].sort((a, b) => b.amount - a.amount);
      
      const fetchedBidders = sortedBids.map((bid, index) => ({
        id: bid.user_id,
        username: `User${bid.user_id}`, // สมมติชื่อผู้ใช้ (ควรดึงจาก API ถ้ามี)
        hiddenUser: `User${bid.user_id.toString().substr(-4)}`, // สมมติชื่อที่ซ่อนบางส่วน
        coins: bid.amount,
        rank: index + 1
      }));
      
      // ถ้ายังไม่มีการประมูล ให้แสดงเป็นลำดับสุดท้าย
      fetchedBidders.forEach(bidder => {
        if (bidder.coins === 0) {
          bidder.rank = fetchedBidders.length; // ให้อยู่ลำดับสุดท้าย
        }
      });
      
      setBidders(fetchedBidders);
      
      // หาราคาเสนอสูงสุดในปัจจุบัน
      const highestBid = fetchedBidders.length > 0 
        ? Math.max(...fetchedBidders.map(b => b.coins)) 
        : 0;
      
      // อัปเดตค่า current_bid
      setCurrentAuctionInfo(prev => ({
        ...prev,
        current_bid: highestBid
      }));
      
      // ตั้งค่า bidAmount ให้เป็นค่าเริ่มต้นที่ถูกต้อง
      const nextBidAmount = highestBid > 0 
        ? highestBid + currentAuctionInfo.min_increment 
        : currentAuctionInfo.initial_bid;
      setBidAmount(nextBidAmount);
      
      // ถ้ามี selectedBidder ให้อัปเดต bidderCoins
      if (selectedBidder) {
        // ค้นหาและอัปเดต bidderCoins ตาม selectedBidder
        const selectedBidderData = fetchedBidders.find(
          (bidder) => bidder.id === selectedBidder.id
        );
        if (selectedBidderData) {
          setBidderCoins(selectedBidderData.coins);
        } else {
          // ถ้าไม่พบข้อมูลผู้ประมูลที่เลือก ให้ตั้งค่าเริ่มต้นเป็น 0
          setBidderCoins(0);
        }
      } else if (fetchedBidders.length > 0) {
        // ถ้าไม่มี selectedBidder แต่มีข้อมูลผู้ประมูล ให้ใช้ข้อมูลของผู้ประมูลอันดับแรก
        setBidderCoins(fetchedBidders[0].coins);
      } else {
        // ถ้าไม่มีทั้ง selectedBidder และข้อมูลผู้ประมูล ให้ตั้งค่าเริ่มต้นเป็น 0
        setBidderCoins(0);
      }
      
      setIsLoading(false);
    } catch (err) {
      setError("ไม่สามารถดึงข้อมูลผู้ประมูลได้");
      setIsLoading(false);
      console.error("Error fetching bidders:", err);
    }
  };

  // ในช่วงพัฒนา หากยังไม่มี API จริง ให้ใช้ข้อมูลจำลอง
  useEffect(() => {
    // ลองเรียก API ก่อน
    fetchBidders().catch(() => {
      console.warn("Cannot connect to API, using mock data instead");
      
      // ถ้าเรียก API ไม่สำเร็จ ให้ใช้ข้อมูลจำลอง
      const mockBidders = [
        { id: 1, username: "ร*********", hiddenUser: "JaiJup*****", coins: 100, rank: 1 },
        { id: 2, username: "ร*********", hiddenUser: "Rajir*****", coins: 90, rank: 2 },
        { id: 3, username: "แ*********", hiddenUser: "Manmkiti64", coins: 0, rank: 5 }, // เริ่มต้นที่ 0
        { id: 4, username: "บ*********", hiddenUser: "punra*****", coins: 80, rank: 3 },
        { id: 5, username: "ร*********", hiddenUser: "punra*****", coins: 70, rank: 4 },
      ];
      
      setBidders(mockBidders);
      
      // อัปเดตข้อมูลสำหรับ selectedBidder
      const selected = mockBidders.find(b => b.username === "แ*********");
      if (selected) {
        setBidderCoins(selected.coins);
      }
      
      // ตั้งค่าราคาประมูลเริ่มต้น
      setCurrentAuctionInfo(prev => ({
        ...prev,
        current_bid: Math.max(...mockBidders.map(b => b.coins)) // หาราคาสูงสุดในปัจจุบัน
      }));
      
      setBidAmount(Math.max(currentAuctionInfo.initial_bid, 
                    currentAuctionInfo.current_bid + currentAuctionInfo.min_increment));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auction_id]);

  const handleIncrease = () => {
    setBidAmount((prev) => {
      // เพิ่มทีละ 1 แทนที่จะเพิ่มทีละ min_increment
      const newAmount = prev + 1;
      // ตรวจสอบว่าค่าใหม่ไม่เกินเงินที่มี
      return Math.min(newAmount, userCoins);
    });
  };

  const handleDecrease = () => {
    setBidAmount((prev) => {
      // ลดทีละ 1 แทนที่จะลดทีละ min_increment
      const newAmount = prev - 1;
      
      // กำหนดค่าต่ำสุดโดยตรวจสอบว่าเป็นการประมูลครั้งแรกหรือไม่
      let minBidAmount;
      if (currentAuctionInfo.current_bid > 0) {
        // ถ้ามีการประมูลแล้ว ราคาต่ำสุดคือราคาปัจจุบัน + min_increment
        minBidAmount = currentAuctionInfo.current_bid + currentAuctionInfo.min_increment;
      } else {
        // ถ้ายังไม่มีการประมูล ราคาต่ำสุดคือ initial_bid
        minBidAmount = currentAuctionInfo.initial_bid;
      }
      
      return Math.max(newAmount, minBidAmount);
    });
  };

  const handleBid = async () => {
    // ตรวจสอบเงื่อนไขก่อนเสนอราคา
    if (userCoins < bidAmount) {
      alert("Coins ไม่พอสำหรับลงเงิน กรุณาเติมโชค Coin!");
      return;
    }
    
    // ตรวจสอบว่าราคาที่เสนอต้องมากกว่าราคาปัจจุบัน + min_increment
    if (currentAuctionInfo.current_bid > 0 && bidAmount < currentAuctionInfo.current_bid + currentAuctionInfo.min_increment) {
      alert(`ราคาที่เสนอต้องมากกว่าราคาปัจจุบัน + ${currentAuctionInfo.min_increment} Coins`);
      return;
    }
    
    // ตรวจสอบว่าหากยังไม่มีการเสนอราคา ราคาที่เสนอต้อง >= initial_bid
    if (currentAuctionInfo.current_bid === 0 && bidAmount < currentAuctionInfo.initial_bid) {
      alert(`ราคาเริ่มต้นต้องมากกว่าหรือเท่ากับ ${currentAuctionInfo.initial_bid} Coins`);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // เรียกใช้ API เพื่อเสนอราคา
      const baseUrl = import.meta.env.MODE === 'development' 
        ? 'http://localhost:5173' // หรือ URL ของ backend API ที่ถูกต้อง
        : '';
        
      const response = await axios.put(`${baseUrl}/api/auction/${auction_id}/bid`, {
        amount: bidAmount
        // ไม่ต้องส่ง user_id เพราะ API จะตรวจสอบจาก token ในคุกกี้
      }, {
        // เพิ่ม headers เพื่อป้องกันการ cache
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.status === 200) {
        // ลด Coins ของผู้ใช้
        setUserCoins((prev) => prev - bidAmount);
        
        // อัปเดต current_bid
        setCurrentAuctionInfo(prev => ({
          ...prev,
          current_bid: bidAmount
        }));
        
        // ไม่ต้องเรียก fetchBidders อีก เพราะข้อมูลจะอัปเดตผ่าน SSE โดยอัตโนมัติ
        // อาจแสดงข้อความสำเร็จแทนการเรียก API ซ้ำ
        console.log("Bid placed successfully!");
        
        setIsExpanded(false);
      }
      
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      
      // จัดการข้อผิดพลาดตามรูปแบบ API response
      if (err.response) {
        const { status, data } = err.response;
        
        switch (status) {
          case 400:
            setError(data.detail || "จำนวนเงินที่เสนอไม่ถูกต้อง หรือการประมูลยังไม่เริ่ม/สิ้นสุดแล้ว");
            break;
          case 401:
            setError("กรุณาเข้าสู่ระบบก่อนเสนอราคา");
            break;
          case 403:
            setError("โทเค็นไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่");
            break;
          case 404:
            setError("ไม่พบการประมูลที่ระบุ");
            break;
          case 422:
            setError("ข้อมูลที่ส่งไม่ถูกต้อง");
            break;
          default:
            setError("เกิดข้อผิดพลาดในการเสนอราคา โปรดลองอีกครั้ง");
        }
      } else {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อ โปรดลองอีกครั้ง");
      }
      
      console.error("Error placing bid:", err);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[80%] max-w-[850px] bg-gray-200 shadow-lg rounded-t-lg transition-all duration-300">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-2">
          {error}
        </div>
      )}
      
      <button
        className="flex justify-center w-full py-2 bg-[#E4E4E6] rounded-t-lg cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={isLoading}
      >
        <img src={isExpanded ? Images.down : Images.ArrowUp} alt="Toggle" className="w-4 h-4" />
      </button>

      <div className="flex justify-between items-center px-8 py-4 mx-6 bg-[#77599A] rounded-lg text-white relative shadow-md">
        <div className="flex items-center gap-5">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <img src={Images.CrownTwo} alt="Rank" className="w-full h-full" />
            <span className="absolute text-sm font-bold text-white">
              {selectedBidder && selectedBidder.coins > 0 ? selectedBidder.rank : "-"}
            </span>
          </div>

          <img src={Images.profilemam} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white" />
          <div>
            <p className="text-sm font-semibold">{selectedBidder?.username || "ผู้ประมูล"}</p>
            <p className="text-xs text-gray-300">{selectedBidder?.hiddenUser || "User****"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FFF9E2] to-[#FFF5D1] flex items-center justify-center shadow-md">
            <img src={Images.trophy} alt="Coins" className="w-6 h-6" />
          </div>
          <p className="text-lg font-semibold">{bidderCoins} Coins</p>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gray-200 px-6 py-5 rounded-b-lg shadow-lg">
          <div className="grid grid-cols-2 gap-5 items-center">
            <div className="w-full">
              <LuckCard coins={userCoins} showTopUp={true} />
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md flex flex-col justify-between">
              <div className="flex justify-between text-gray-700 text-sm">
                <p>{currentAuctionInfo.initial_bid} Coins น้อยที่สุด</p>
                <p>{userCoins} Coins มากที่สุด</p>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  className="bg-[#5A189A] text-white w-9 h-9 flex items-center justify-center rounded-full"
                  onClick={handleDecrease}
                  disabled={isLoading}
                >
                  −
                </button>
                <div className="relative w-full">
                  {/* แถบสีแสดงจำนวนเงินที่เสนอ (อยู่ด้านล่าง input) */}
                  <div className="absolute top-1/2 left-0 h-2 bg-[#E4E4E6] w-full rounded-full transform -translate-y-1/2"></div>
                  <div 
                    className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-[#9D4EDD] to-[#5A189A] rounded-full transform -translate-y-1/2" 
                    style={{ 
                      width: `${((bidAmount - Math.min(currentAuctionInfo.initial_bid, currentAuctionInfo.current_bid + currentAuctionInfo.min_increment)) / (userCoins - Math.min(currentAuctionInfo.initial_bid, currentAuctionInfo.current_bid + currentAuctionInfo.min_increment))) * 100}%`,
                      maxWidth: '100%'
                    }}
                  ></div>
                  
                  {/* Slider อยู่ด้านบนสุด */}
                  <input
                    type="range"
                    min={currentAuctionInfo.current_bid > 0 
                      ? currentAuctionInfo.current_bid + currentAuctionInfo.min_increment 
                      : currentAuctionInfo.initial_bid}
                    max={userCoins}
                    step={1} 
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full z-10 relative appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[#5A189A] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full"
                    disabled={isLoading}
                  />
                </div>
                <button
                  className="bg-[#5A189A] text-white w-9 h-9 flex items-center justify-center rounded-full"
                  onClick={handleIncrease}
                  disabled={isLoading}
                >
                  +
                </button>
              </div>

              <p className="text-2xl font-bold text-center mt-3">{bidAmount} Coins</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 px-4">
            <button
              onClick={() => navigate("/homepage", { state: { joinedAuction: true } })}
              className="text-[#5A189A] text-sm flex items-center"
              disabled={isLoading}
            >
              <img src={Images.back} alt="Back" className="w-5 h-5 mr-1" />
              หน้าหลัก
            </button>

            <button 
              className={`${
                isLoading 
                  ? "bg-gray-400" 
                  : "bg-[#77599A]"
              } text-white py-2 px-8 rounded-full font-medium shadow-md`} 
              onClick={handleBid}
              disabled={isLoading}
            >
              {isLoading ? "กำลังประมวลผล..." : "ลงเงิน"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidAuctionFooter;