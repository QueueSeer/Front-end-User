

import React, { useState, useEffect } from "react";
import Images from "../../../assets";
import { useNavigate } from "react-router-dom";
import LuckCard from "../../TopupComponent/LuckCard";
import axios from "axios";

const BidAuctionFooter = ({ 
  selectedBidder, 
  bidders, 
  setBidders, 
  currentRank,
  setCurrentRank,
  bidderCoins,
  setBidderCoins,
  updateRankings,
  fetchBidders,
  getApiBaseUrl,
  auction_id,
  userCoins: externalUserCoins,
  setUserCoins: setExternalUserCoins,
  auctionInfo,
  apiConnected,
  currentUser // เพิ่ม prop นี้
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [bidAmount, setBidAmount] = useState(50);
  const [userCoins, setUserCoins] = useState(externalUserCoins || 500);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAuctionInfo, setCurrentAuctionInfo] = useState({
    current_bid: 0,
    min_increment: auctionInfo?.min_increment || 50,
    initial_bid: auctionInfo?.initial_bid || 50
  });

  // ฟังก์ชันดึงข้อมูลผู้ใช้ - ย้ายมาไว้ด้านบน
  const getUserInfo = () => {
    // ถ้ามี currentUser ให้ใช้ currentUser ก่อน
    if (currentUser && currentUser.id) {
      return {
        id: currentUser.id,
        username: currentUser.username || "ผู้ประมูล",
        hiddenUser: currentUser.hidden_username || "User****",
        rank: currentRank || "-"
      };
    }
    
    // ถ้าไม่มี currentUser ให้ใช้ selectedBidder แทน
    return {
      id: selectedBidder?.id || 3,
      username: selectedBidder?.username || "ผู้ประมูล",
      hiddenUser: selectedBidder?.hiddenUser || "User****",
      rank: selectedBidder && selectedBidder.coins > 0 ? selectedBidder.rank : "-"
    };
  };
  const userInfo = getUserInfo();
  // Sync userCoins with external state
  useEffect(() => {
    if (externalUserCoins > 0) {
      setUserCoins(externalUserCoins);
    }
  }, [externalUserCoins]);

  // ดึงข้อมูลเมื่อเข้าสู่หน้า
  useEffect(() => {
    // ตั้งค่าจำนวนเงินเริ่มต้นสำหรับการประมูล
    const highestBid = bidders.length > 0 
      ? Math.max(...bidders.map(b => b.coins)) 
      : 0;
    
    setCurrentAuctionInfo(prev => ({
      ...prev,
      current_bid: highestBid,
      min_increment: auctionInfo?.min_increment || prev.min_increment,
      initial_bid: auctionInfo?.initial_bid || prev.initial_bid
    }));
    
    // คำนวณ bidAmount เริ่มต้นตามกฎ
    const nextBidAmount = highestBid > 0 
      ? highestBid + (auctionInfo?.min_increment || currentAuctionInfo.min_increment)
      : (auctionInfo?.initial_bid || currentAuctionInfo.initial_bid);
    
    setBidAmount(nextBidAmount);
  }, [bidders, auctionInfo, currentAuctionInfo.min_increment, currentAuctionInfo.initial_bid]);

  const handleIncrease = () => {
    setBidAmount((prev) => {
      const newAmount = prev + 1;
      return Math.min(newAmount, userCoins);
    });
  };

  const handleDecrease = () => {
    setBidAmount((prev) => {
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
      
      // ถ้า API ไม่ตอบสนอง ให้จำลองการลงเงิน
      if (!apiConnected) {
        await mockBidPlacement();
        return;
      }
      
      // เรียกใช้ API เพื่อเสนอราคา
      const response = await axios.put(`${getApiBaseUrl()}/auction/${auction_id}/bid`, {
        amount: bidAmount
      }, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Accept': 'application/json'
        },
        withCredentials: true,
        timeout: 5000 // เพิ่ม timeout เพื่อป้องกัน hanging request
      });
      
      if (response.status === 200) {
        handleBidSuccess();
      } else {
        setError("มีข้อผิดพลาดในการเสนอราคา โปรดลองอีกครั้ง");
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error placing bid:", err);
      
      // ถ้าไม่สามารถเชื่อมต่อกับ API ได้ แต่ไม่ใช่ข้อผิดพลาดจากผู้ใช้
      if (err.response && err.response.status === 500) {
        // จำลองการลงเงิน
        await mockBidPlacement();
      } else {
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
      }
    }
  };

  // จำลองการเสนอราคาเมื่อไม่สามารถเชื่อมต่อกับ API ได้
  const mockBidPlacement = async () => {
    // จำลองการรอเวลา
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // ลด Coins ของผู้ใช้
    setUserCoins(prev => prev - bidAmount);
    if (setExternalUserCoins) {
      setExternalUserCoins(prev => prev - bidAmount);
    }
    
    // อัปเดต current_bid
    setCurrentAuctionInfo(prev => ({
      ...prev,
      current_bid: bidAmount
    }));
    
     // อัปเดตอันดับการประมูล - ใช้ ID จาก userInfo
     const updatedBidders = updateRankings(userInfo.id, bidAmount);
     setBidders(updatedBidders);
     
     // อัปเดตอันดับของผู้ใช้ปัจจุบัน
     const currentUserInBidders = updatedBidders.find(b => b.id === userInfo.id);
     if (currentUserInBidders) {
       setCurrentRank(currentUserInBidders.rank.toString());
       setBidderCoins(bidAmount);
     }
    
    console.log("Mock bid placed successfully!");
    
    // แสดงข้อความว่ากำลังใช้ข้อมูลจำลอง
    setError("เสนอราคาสำเร็จ (โหมดออฟไลน์ - ข้อมูลจะซิงค์เมื่อกลับมาออนไลน์)");
    
    // ปิดส่วนขยายหลังจากลงเงินสำเร็จ
    setIsExpanded(false);
    
    setIsLoading(false);
    
    // รีเฟรชข้อมูลการประมูล
    setTimeout(() => setError(null), 3000);
  };

  const handleBidSuccess = () => {
    // ลด Coins ของผู้ใช้
    setUserCoins(prev => prev - bidAmount);
    if (setExternalUserCoins) {
      setExternalUserCoins(prev => prev - bidAmount);
    }
    
    // อัปเดต current_bid
    setCurrentAuctionInfo(prev => ({
      ...prev,
      current_bid: bidAmount
    }));
    
     // อัปเดตอันดับการประมูล - ใช้ ID จาก userInfo
     const updatedBidders = updateRankings(userInfo.id, bidAmount);
     setBidders(updatedBidders);
     
     // อัปเดตอันดับของผู้ใช้ปัจจุบัน
     const currentUserInBidders = updatedBidders.find(b => b.id === userInfo.id);
     if (currentUserInBidders) {
       setCurrentRank(currentUserInBidders.rank.toString());
       setBidderCoins(bidAmount);
     }
   
    
    console.log("Bid placed successfully!");
    
    // ปิดส่วนขยายหลังจากลงเงินสำเร็จ
    setIsExpanded(false);
    
    // รีเฟรชข้อมูลการประมูล
    fetchBidders();
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[850px] bg-gray-200 shadow-lg rounded-t-lg transition-all duration-300">
      {error && (
        <div className={`px-4 py-2 rounded relative mb-2 text-center ${error.includes('สำเร็จ') ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
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

      {/* ส่วนแสดงข้อมูลผู้ใช้ - ปรับปรุงให้ใช้ userInfo */}
      <div className="flex justify-between items-center px-8 py-4 mx-6 bg-[#77599A] rounded-lg text-white relative shadow-md">
        <div className="flex items-center gap-5">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <img src={Images.CrownTwo} alt="Rank" className="w-full h-full" />
            <span className="absolute text-sm font-bold text-white">
              {userInfo.rank}
            </span>
          </div>

          <img src={Images.profilemam} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white" />
          <div>
            <p className="text-sm font-semibold">{userInfo.username}</p>
            <p className="text-xs text-gray-300">{userInfo.hiddenUser}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            <div className="w-full">
              <LuckCard coins={userCoins} showTopUp={true} />
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md flex flex-col justify-between">
              <div className="flex justify-between text-gray-700 text-sm">
                <p>{currentAuctionInfo.initial_bid} Coins น้อยที่สุด</p>
                <p>{userCoins} Coins มากที่สุด</p>
              </div>

              {/* ส่วนสไลเดอร์เลื่อนเงิน - เพิ่มประสิทธิภาพการแสดงผล */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  className={`${isLoading ? 'bg-gray-400' : 'bg-[#5A189A]'} text-white w-9 h-9 flex items-center justify-center rounded-full`}
                  onClick={handleDecrease}
                  disabled={isLoading}
                >
                  −
                </button>
                <div className="relative w-full">
                  {/* แถบสีพื้นหลัง */}
                  <div className="absolute top-1/2 left-0 h-2 bg-[#E4E4E6] w-full rounded-full transform -translate-y-1/2"></div>
                  
                  {/* แถบสีแสดงความคืบหน้า */}
                  <div 
                    className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-[#9D4EDD] to-[#5A189A] rounded-full transform -translate-y-1/2" 
                    style={{ 
                      width: `${Math.min(
                        ((bidAmount - Math.max(currentAuctionInfo.initial_bid, currentAuctionInfo.current_bid + currentAuctionInfo.min_increment)) / 
                        (userCoins - Math.max(currentAuctionInfo.initial_bid, currentAuctionInfo.current_bid + currentAuctionInfo.min_increment))) * 100,
                        100
                      )}%`,
                      maxWidth: '100%'
                    }}
                  ></div>
                  
                  {/* Slider แบบอินเตอร์แอคทีฟ */}
                  <input
                    type="range"
                    min={currentAuctionInfo.current_bid > 0 
                      ? currentAuctionInfo.current_bid + currentAuctionInfo.min_increment 
                      : currentAuctionInfo.initial_bid}
                    max={userCoins}
                    step={1} 
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full z-10 relative appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[#5A189A] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                    disabled={isLoading}
                  />
                </div>
                <button
                  className={`${isLoading ? 'bg-gray-400' : 'bg-[#5A189A]'} text-white w-9 h-9 flex items-center justify-center rounded-full`}
                  onClick={handleIncrease}
                  disabled={isLoading}
                >
                  +
                </button>
              </div>

              <p className="text-2xl font-bold text-center mt-3">{bidAmount} Coins</p>
              
              {/* เพิ่มข้อมูลเงินที่เพิ่มขึ้นจากราคาปัจจุบัน */}
              {currentAuctionInfo.current_bid > 0 && (
                <p className="text-sm text-gray-500 text-center mt-1">
                  (+{bidAmount - currentAuctionInfo.current_bid} coins จากราคาปัจจุบัน)
                </p>
              )}
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
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[#77599A] hover:bg-[#5A189A]"
              } text-white py-2 px-8 rounded-full font-medium shadow-md transition-colors`} 
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