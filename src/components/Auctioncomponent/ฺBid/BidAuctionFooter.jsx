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
  currentUser 
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [bidAmount, setBidAmount] = useState(50);
  const [userCoins, setUserCoins] = useState(externalUserCoins || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userProfile, setUserProfile] = useState({
    id: null,
    username: "",
    display_name: "",
    image: null,
    coins: 0
  });
  const [currentAuctionInfo, setCurrentAuctionInfo] = useState({
    current_bid: 0,
    min_increment: auctionInfo?.min_increment || 50,
    initial_bid: auctionInfo?.initial_bid || 50
  });

  // ดึงข้อมูลผู้ใช้จาก API
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${getApiBaseUrl()}/user/me`, {
        headers: {
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.data) {
        setUserProfile({
          id: response.data.id,
          username: response.data.username || "",
          display_name: response.data.display_name || response.data.username || "",
          image: response.data.image || null,
          coins: response.data.coins || 0
        });
        
        // อัปเดต coins ด้วยข้อมูลจาก API
        if (response.data.coins !== undefined) {
          setUserCoins(response.data.coins);
          if (setExternalUserCoins) {
            setExternalUserCoins(response.data.coins);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // เรียกข้อมูลผู้ใช้เมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Sync userCoins with external state
  useEffect(() => {
    if (externalUserCoins > 0) {
      setUserCoins(externalUserCoins);
    }
  }, [externalUserCoins]);

  // ดึงข้อมูลเมื่อเข้าสู่หน้า
  useEffect(() => {
    // หาราคาสูงสุดในปัจจุบัน
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

  // ใช้ข้อมูลจาก parent component และ API ร่วมกัน
  useEffect(() => {
    if (currentUser && currentUser.id) {
      if (!userProfile.id) {
        setUserProfile(prev => ({
          ...prev,
          id: currentUser.id,
          username: currentUser.username || prev.username,
          display_name: currentUser.display_name || currentUser.username || prev.display_name,
          image: currentUser.profileImage || prev.image
        }));
      }
    }
  }, [currentUser]);

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
    // ใช้ ID จาก userProfile หรือ currentUser ขึ้นอยู่กับว่าอันไหนมีค่า
    const userId = userProfile.id || (currentUser ? currentUser.id : null);
    
    // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
    if (!userId) {
      setError("กรุณาเข้าสู่ระบบก่อนเสนอราคา");
      return;
    }
    
    // ตรวจสอบเงื่อนไขก่อนเสนอราคา
    if (userCoins < bidAmount) {
      setError("Coins ไม่พอสำหรับลงเงิน กรุณาเติมโชค Coin!");
      return;
    }
    
    // ตรวจสอบว่าราคาที่เสนอต้องมากกว่าราคาปัจจุบัน + min_increment
    if (currentAuctionInfo.current_bid > 0 && bidAmount < currentAuctionInfo.current_bid + currentAuctionInfo.min_increment) {
      setError(`ราคาที่เสนอต้องมากกว่าราคาปัจจุบัน + ${currentAuctionInfo.min_increment} Coins`);
      return;
    }
    
    // ตรวจสอบว่าหากยังไม่มีการเสนอราคา ราคาที่เสนอต้อง >= initial_bid
    if (currentAuctionInfo.current_bid === 0 && bidAmount < currentAuctionInfo.initial_bid) {
      setError(`ราคาเริ่มต้นต้องมากกว่าหรือเท่ากับ ${currentAuctionInfo.initial_bid} Coins`);
      return;
    }

    // ตรวจสอบว่าผู้ใช้ไม่ได้เสนอราคาแข่งกับตัวเอง (ถ้าผู้ใช้เป็นผู้ที่มีราคาสูงสุดอยู่แล้ว)
    const highestBidder = bidders.length > 0 ? 
      bidders.find(b => b.coins === currentAuctionInfo.current_bid) : null;
      
    if (highestBidder && highestBidder.id === userId) {
      setError("คุณไม่สามารถเสนอราคาแข่งกับตัวเองได้");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      // เรียกใช้ API เพื่อเสนอราคา
      const response = await axios.put(`${getApiBaseUrl()}/auction/${auction_id}/bid`, {
        amount: bidAmount
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      
      // ตรวจสอบว่าการเสนอราคาสำเร็จหรือไม่
      if (response.status === 200) {
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
        
        // อัปเดตอันดับการประมูล
        setBidderCoins(bidAmount);
        
        // อัปเดตข้อมูลผู้ใช้ใหม่หลังจากการประมูล
        fetchUserProfile();
        
        // แสดงข้อความสำเร็จ
        setSuccessMessage("เสนอราคาสำเร็จ!");
        
        // ปิดส่วนขยายหลังจากลงเงินสำเร็จ
        setIsExpanded(false);
        
        // รีเฟรชข้อมูลการประมูล
        fetchBidders();
        
        // ซ่อนข้อความสำเร็จหลังจาก 3 วินาที
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error("Error placing bid:", err);
      
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
      } else if (err.request) {
        // การร้องขอถูกส่งแล้วแต่ไม่ได้รับการตอบกลับ
        setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
      } else {
        // เกิดข้อผิดพลาดในการตั้งค่าการร้องขอ
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อ โปรดลองอีกครั้ง");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ค้นหาข้อมูลผู้ประมูลจากรายการ bidders
  const findCurrentBidder = () => {
    const userId = userProfile.id || (currentUser ? currentUser.id : null);
    if (!userId) return null;
    return bidders.find(bidder => bidder.id === userId);
  };

  // ข้อมูลผู้ประมูลปัจจุบัน
  const currentBidder = findCurrentBidder();
  
  // คำนวณอันดับและจำนวนเงินประมูลปัจจุบัน
  const getUserRank = () => {
    if (currentBidder) {
      return currentBidder.rank.toString();
    }
    return currentRank || "-";
  };

  const getCurrentBidAmount = () => {
    if (currentBidder) {
      return currentBidder.coins;
    }
    return bidderCoins || 0;
  };

  // สร้างชื่อผู้ใช้ที่ซ่อนบางส่วน (เช่น User****) สำหรับการแสดงผล
  const getHiddenUsername = () => {
    // ใช้ข้อมูลจาก currentUser.hiddenUser ถ้ามี, มิฉะนั้นสร้างจาก userProfile.username
    if (currentUser && currentUser.hiddenUser) {
      return currentUser.hiddenUser;
    }
    
    if (userProfile.username) {
      if (userProfile.username.length > 4) {
        return userProfile.username.substring(0, 4) + '****';
      }
      return userProfile.username + '****';
    }
    
    return 'User****';
  };

  // ดึงชื่อที่จะแสดงผล (display name)
  const getDisplayName = () => {
    // เรียงลำดับความสำคัญ: userProfile.display_name > currentUser.username > userProfile.username > "ผู้ประมูล"
    if (userProfile.display_name) {
      return userProfile.display_name;
    }
    
    if (currentUser && currentUser.username) {
      return currentUser.username;
    }
    
    return userProfile.username || "ผู้ประมูล";
  };

  // ดึง URL รูปโปรไฟล์
  const getProfileImage = () => {
    // เรียงลำดับความสำคัญ: userProfile.image > currentUser.profileImage > null
    return userProfile.image || (currentUser ? currentUser.profileImage : null);
  };

  // ตรวจสอบว่าผู้ใช้เคยประมูลเเพ็คเกจนี้หรือไม่
  const hasUserBid = () => {
    return currentBidder && currentBidder.coins > 0;
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[850px] bg-gray-200 shadow-lg rounded-t-lg transition-all duration-300">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-2 text-center">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative mb-2 text-center">
          {successMessage}
        </div>
      )}
      
      <button
        className="flex justify-center w-full py-2 bg-[#E4E4E6] rounded-t-lg cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={isLoading}
      >
        <img src={isExpanded ? Images.down : Images.ArrowUp} alt="Toggle" className="w-4 h-4" />
      </button>

      {/* ส่วนแสดงข้อมูลผู้ใช้ */}
      <div className="flex justify-between items-center px-8 py-4 mx-6 bg-[#77599A] rounded-lg text-white relative shadow-md">
        <div className="flex items-center gap-5">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <img src={Images.CrownTwo} alt="Rank" className="w-full h-full" />
            <span className="absolute text-sm font-bold text-white">
              {getUserRank()}
            </span>
          </div>

          {/* รูปโปรไฟล์ผู้ใช้ */}
          {getProfileImage() ? (
            <img 
              src={getProfileImage()} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-purple-300 text-white font-bold">
              {getDisplayName().charAt(0).toUpperCase()}
            </div>
          )}

          {/* ชื่อผู้ใช้ */}
          <div>
            <p className="text-sm font-semibold">{getDisplayName()}</p>
            <p className="text-xs text-gray-300">{getHiddenUsername()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FFF9E2] to-[#FFF5D1] flex items-center justify-center shadow-md">
            <img src={Images.trophy} alt="Coins" className="w-6 h-6" />
          </div>
          <p className="text-lg font-semibold">{getCurrentBidAmount()} Coins</p>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gray-200 px-6 py-5 rounded-b-lg shadow-lg">
          {/* แสดงสถานะการประมูลสำหรับผู้ใช้ */}
          {hasUserBid() ? (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded mb-4 text-center">
              คุณกำลังประมูลแพ็คเกจนี้ในอันดับที่ <span className="font-bold">{getUserRank()}</span> ด้วยจำนวน <span className="font-bold">{getCurrentBidAmount()}</span> Coins
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded mb-4 text-center">
              คุณยังไม่ได้ประมูลแพ็คเกจนี้
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            <div className="w-full">
              <LuckCard coins={userCoins} showTopUp={true} />
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md flex flex-col justify-between">
              <div className="flex justify-between text-gray-700 text-sm">
                <p>{currentAuctionInfo.initial_bid} Coins น้อยที่สุด</p>
                <p>{userCoins} Coins มากที่สุด</p>
              </div>

              {/* ส่วนสไลเดอร์เลื่อนเงิน */}
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
                        Math.max(1, userCoins - Math.max(currentAuctionInfo.initial_bid, currentAuctionInfo.current_bid + currentAuctionInfo.min_increment))) * 100,
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
              
              {/* แสดงสถานะการประมูลสุดท้าย */}
              {hasUserBid() && bidAmount > getCurrentBidAmount() && (
                <p className="text-sm text-green-600 text-center mt-2">
                  เพิ่มจาก {getCurrentBidAmount()} Coins ที่คุณประมูลไว้
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
              {isLoading ? "กำลังประมวลผล..." : hasUserBid() ? "เพิ่มเงินประมูล" : "ลงเงิน"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidAuctionFooter;