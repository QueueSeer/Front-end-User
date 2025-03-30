import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BidAuctionHeader from "../../components/Auctioncomponent/ฺBid/BidAuctionHeader";
import BidAuctionList from "../../components/Auctioncomponent/ฺBid/BidAuctionList";
import BidAuctionFooter from "../../components/Auctioncomponent/ฺBid/BidAuctionFooter";
import WinnerPopup from "../../components/Auctioncomponent/ฺBid/WinnerPopup";
import LoserPopup from "../../components/Auctioncomponent/ฺBid/LoserPopup";
import Navbar from "../../components/navbar";

// API Base URL
const API_BASE_URL = 'https://backend.qseer.app/api';

const BidAuction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auction_id } = useParams();
  const auctionId = auction_id || location.state?.auction_id;
  
  // รับค่าพารามิเตอร์จาก location.state
  const initialBidFromState = location.state?.initialBid || 0;
  const minIncrementFromState = location.state?.minIncrement || 0;
  const auctioneerNameFromState = location.state?.auctioneerName || "หมอดู เพียงฟ้า พาขวัญ";

  const [idError, setIdError] = useState(false);
  const [auctioneer, setAuctioneer] = useState(auctioneerNameFromState);
  const [timeLeft, setTimeLeft] = useState([
    { label: "วัน", value: "0" },
    { label: "ชั่วโมง", value: "0" },
    { label: "นาที", value: "0" },
    { label: "วินาที", value: "0" }
  ]);
  
  const [bidders, setBidders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auctionInfo, setAuctionInfo] = useState({
    initial_bid: initialBidFromState,
    min_increment: minIncrementFromState,
    auctioneer_name: auctioneerNameFromState
  });
  const [currentRank, setCurrentRank] = useState("0");
  const [bidderCoins, setBidderCoins] = useState(0);
  const [userCoins, setUserCoins] = useState(0);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    username: "",
    hiddenUser: "",
    profileImage: null
  });

  // ตรวจสอบ auction_id
  useEffect(() => {
    if (!auctionId) {
      setIdError(true);
      setError("ไม่พบข้อมูล auction_id กรุณาเข้าสู่หน้านี้จากลิงก์ที่ถูกต้อง");
      return;
    }
    setIdError(false);
    setError(null);
  }, [auctionId]);

  // ฟังก์ชันดึงข้อมูลผู้ใช้จาก API
  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      
      const response = await axios.get(`${API_BASE_URL}/user/me`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.data) {
        // อัปเดตข้อมูล Coins
        if (response.data.coins !== undefined) {
          setUserCoins(response.data.coins);
          console.log("User coins fetched:", response.data.coins);
        }
        
        // อัปเดตข้อมูลผู้ใช้
        setCurrentUser({
          id: response.data.id,
          username: response.data.username || "",
          hiddenUser: response.data.hidden_username || "",
          profileImage: response.data.profile_image || null
        });
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      if (err.response?.status === 401) {
        // ไม่ได้ล็อกอิน - อาจจะต้องนำทางไปยังหน้าล็อกอิน
        console.log("User not logged in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันดึงข้อมูลผู้ประมูลจากเหตุการณ์ stream
  const processBidsData = (data) => {
    if (!Array.isArray(data)) {
      console.error("Bids data is not an array:", data);
      return;
    }

    // แยกผู้ที่มีการลงเงินและยังไม่ได้ลงเงิน
    const activeBids = data.filter(bid => bid.amount > 0);
    const zeroBids = data.filter(bid => bid.amount === 0);
    
    // เรียงลำดับผู้ที่ลงเงินแล้วตามจำนวนเงิน (มากไปน้อย)
    const sortedActiveBids = [...activeBids].sort((a, b) => b.amount - a.amount);
    
    // แปลงเป็น bidders ที่มีการลงเงินแล้ว พร้อมกำหนดลำดับ
    const activeBidders = sortedActiveBids.map((bid, index) => ({
      id: bid.user_id,
      username: bid.username || `User${bid.user_id}`, 
      hiddenUser: bid.hidden_username || `User${bid.user_id.toString().substr(-4)}`,
      coins: bid.amount,
      rank: index + 1
    }));
    
    // ค้นหาลำดับสุดท้ายของผู้ที่ลงเงิน
    const lastRank = activeBidders.length > 0 ? activeBidders.length : 0;
    
    // แปลงเป็น bidders ที่ยังไม่ได้ลงเงิน กำหนดอันดับเป็นลำดับสุดท้าย + 1
    const zeroBidders = zeroBids.map(bid => ({
      id: bid.user_id,
      username: bid.username || `User${bid.user_id}`,
      hiddenUser: bid.hidden_username || `User${bid.user_id.toString().substr(-4)}`,
      coins: 0,
      rank: lastRank + 1
    }));
    
    // รวม bidders ทั้งหมด
    const fetchedBidders = [...activeBidders, ...zeroBidders];
    
    setBidders(fetchedBidders);
    
    // อัปเดตข้อมูลของผู้ใช้ปัจจุบัน (ถ้ามี)
    if (currentUser.id) {
      const currentUserBidder = fetchedBidders.find(b => b.id === currentUser.id);
      if (currentUserBidder) {
        setBidderCoins(currentUserBidder.coins);
        setCurrentRank(currentUserBidder.rank.toString());
      }
    }
  };

  // ฟังก์ชันรองรับการดึงข้อมูล bids แบบฉุกเฉิน
  const fetchBidders = async () => {
    if (!auctionId) {
      console.error("Missing auction_id, cannot fetch bidders");
      return;
    }

    try {
      setIsLoading(true);
      
      // ใช้ SSE endpoint ซึ่งควรส่งข้อมูลเริ่มต้นกลับมาด้วย
      const response = await axios.get(`${API_BASE_URL}/auction/${auctionId}/bids/stream?times=1`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      
      console.log("Bids API Response:", response.data);
      
      // ตรวจสอบว่า response.data เป็นอาร์เรย์หรือไม่
      let bidsArray = [];
      if (Array.isArray(response.data)) {
        bidsArray = response.data;
      } else if (response.data && typeof response.data === 'object') {
        // อาจจะมีการห่อหุ้มอาร์เรย์ไว้ในฟิลด์อื่น
        const possibleArrayFields = ['bids', 'items', 'data', 'results'];
        for (const field of possibleArrayFields) {
          if (Array.isArray(response.data[field])) {
            bidsArray = response.data[field];
            break;
          }
        }
      }
      
      processBidsData(bidsArray);
      setError(null);
      
    } catch (err) {
      console.error("Error fetching bidders:", err);
      setError("ไม่สามารถดึงข้อมูลผู้ประมูลได้");
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันอัปเดตอันดับสำหรับทุกคน
  const updateRankings = (currentUserId, newCoins) => {
    // คัดลอก bidders มาทำงาน
    const updatedBidders = [...bidders];
    
    // ค้นหาผู้ใช้ปัจจุบันในรายการ bidders
    const currentUserIndex = updatedBidders.findIndex(b => b.id === currentUserId);
    
    // อัปเดตจำนวน coins ของผู้ใช้ปัจจุบัน
    if (currentUserIndex !== -1) {
      updatedBidders[currentUserIndex].coins = newCoins;
    } else {
      // ถ้าไม่พบผู้ใช้ในรายการ ให้เพิ่มเข้าไป
      updatedBidders.push({
        id: currentUserId,
        username: currentUser.username || "",
        hiddenUser: currentUser.hiddenUser || "",
        coins: newCoins,
        rank: 0 // จะถูกอัปเดตในขั้นตอนต่อไป
      });
    }
    
    // แยกผู้ประมูลเป็น 2 กลุ่ม: มีการลงเงิน และ ยังไม่ได้ลงเงิน
    const activeBidders = updatedBidders.filter(b => b.coins > 0);
    const zeroBidders = updatedBidders.filter(b => b.coins === 0);
    
    // เรียงลำดับผู้ที่ลงเงินแล้วตามจำนวนเงิน (มากไปน้อย)
    activeBidders.sort((a, b) => {
      if (b.coins === a.coins) {
        // ถ้าจำนวนเงินเท่ากัน ให้ผู้ที่ลงเงินล่าสุดอยู่อันดับที่ดีกว่า
        return a.id === currentUserId ? -1 : b.id === currentUserId ? 1 : 0;
      }
      return b.coins - a.coins;
    });
    
    // อัปเดตลำดับ (rank) สำหรับผู้ที่มีการลงเงินแล้ว
    activeBidders.forEach((bidder, index) => {
      bidder.rank = index + 1;
    });
    
    // กำหนดลำดับสำหรับผู้ที่ยังไม่ได้ลงเงิน
    const lastActiveRank = activeBidders.length;
    zeroBidders.forEach(bidder => {
      bidder.rank = lastActiveRank + 1;
    });
    
    // ตรวจสอบและปรับอันดับที่ซ้ำกันสำหรับผู้ที่มีจำนวนเงินเท่ากัน (tie)
    let previousCoins = -1;
    let previousRank = 0;
    
    activeBidders.forEach(bidder => {
      if (bidder.coins === previousCoins) {
        // ถ้าเงินเท่ากับคนก่อนหน้า ให้ใช้อันดับเดียวกัน
        bidder.rank = previousRank;
      } else {
        // ถ้าเงินไม่เท่ากับคนก่อนหน้า ให้บันทึกค่าใหม่
        previousCoins = bidder.coins;
        previousRank = bidder.rank;
      }
    });
    
    // รวมรายการผู้ประมูลกลับเข้าด้วยกัน
    return [...activeBidders, ...zeroBidders];
  };

  // ฟังก์ชันดึงข้อมูลการประมูล
  const fetchAuctionInfo = async () => {
    if (!auctionId) {
      console.error("Missing auction_id, cannot fetch auction info");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/auction/${auctionId}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      
      const data = response.data;
      setAuctionInfo({
        initial_bid: data.initial_bid || auctionInfo.initial_bid,
        min_increment: data.min_increment || auctionInfo.min_increment,
        auctioneer_name: data.auctioneer_name || auctionInfo.auctioneer_name,
        end_time: data.end_time
      });
      
      // อัปเดตชื่อผู้ประมูล
      if (data.auctioneer_name) {
        setAuctioneer(data.auctioneer_name);
      }
      
      // อัปเดตเวลาที่เหลือ
      if (data.end_time) {
        updateTimeLeft(data.end_time);
      }
    } catch (err) {
      console.error("Error fetching auction info:", err);
      setError("ไม่สามารถดึงข้อมูลการประมูลได้");
    }
  };

  const updateTimeLeft = (endTimeStr) => {
    const endTime = new Date(endTimeStr).getTime();
    let hasCheckedWinner = false; // ตัวแปรเพื่อติดตามว่าได้ตรวจสอบผู้ชนะแล้วหรือยัง
    
    // อัปเดตเวลาทุกวินาที
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;
      
      if (distance <= 0) {
        // เมื่อเวลาหมด
        clearInterval(timer);
        setTimeLeft([
          { label: "วัน", value: "00" },
          { label: "ชั่วโมง", value: "00" },
          { label: "นาที", value: "00" },
          { label: "วินาที", value: "00" }
        ]);
        
        // ตรวจสอบผู้ชนะเพียงครั้งเดียว
        if (!hasCheckedWinner) {
          hasCheckedWinner = true;
          
          // ดึงข้อมูลผู้ประมูลล่าสุด
          fetchBidders().then(() => {
            // ตรวจสอบว่าผู้ใช้ปัจจุบันชนะหรือไม่
            const userBidder = bidders.find(b => b.id === currentUser.id);
            if (userBidder && userBidder.rank === 1) {
              // ผู้ใช้ชนะการประมูล
              setShowWinnerPopup(true);
            } else if (userBidder) {
              // ผู้ใช้แพ้การประมูล
              setShowLoserPopup(true);
            }
          });
        }
        
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // ใช้ padStart เพื่อให้เป็น 2 หลักเสมอ
      setTimeLeft([
        { label: "วัน", value: days.toString().padStart(2, '0') },
        { label: "ชั่วโมง", value: hours.toString().padStart(2, '0') },
        { label: "นาที", value: minutes.toString().padStart(2, '0') },
        { label: "วินาที", value: seconds.toString().padStart(2, '0') }
      ]);
    }, 1000);
    
    return () => clearInterval(timer);
  };

  // ใช้ Server-Sent Events (SSE) เพื่อรับข้อมูลแบบ real-time
  useEffect(() => {
    if (!auctionId) {
      console.error("Missing auction_id, cannot initialize data fetching");
      return;
    }
    
    // ดึงข้อมูลเริ่มต้น
    fetchAuctionInfo();
    fetchBidders();
    fetchUserInfo();
    
    // ใช้ SSE ถ้าบราวเซอร์รองรับ
    let eventSource;
    let pollingInterval;
    
    try {
      // เริ่มการเชื่อมต่อ SSE
      eventSource = new EventSource(`${API_BASE_URL}/auction/${auctionId}/bids/stream?times=600`);
      
      // เมื่อได้รับข้อมูลใหม่
      eventSource.onmessage = (event) => {
        console.log("SSE received data:", event.data);
        
        try {
          const data = JSON.parse(event.data);
          processBidsData(data);
        } catch (err) {
          console.error("Error parsing SSE data:", err);
        }
      };
      
      // จัดการข้อผิดพลาด
      eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
        
        // ปิดการเชื่อมต่อ SSE
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        
        // ใช้ polling เป็นตัวสำรอง
        pollingInterval = setInterval(() => {
          if (!isLoading) {
            fetchBidders();
            // อัปเดต user coins ทุก 30 วินาที
            if (Math.random() < 0.3) fetchUserInfo();
          }
        }, 10000);
      };
    } catch (err) {
      console.error("Error initializing SSE:", err);
      
      // ใช้ polling เป็นตัวสำรอง
      pollingInterval = setInterval(() => {
        if (!isLoading) {
          fetchBidders();
          // อัปเดต user coins ทุก 30 วินาที
          if (Math.random() < 0.3) fetchUserInfo();
        }
      }, 10000);
    }
    
    // ทำความสะอาดเมื่อ component unmount
    return () => {
      console.log("Cleaning up resources");
      if (eventSource) {
        eventSource.close();
      }
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [auctionId]);

  // หาข้อมูลผู้ประมูลของผู้ใช้ปัจจุบัน
  const selectedBidder = currentUser.id
    ? bidders.find((bidder) => bidder.id === currentUser.id)
    : null;

  // เช็คสถานะจาก `location.state` เพื่อแสดง Popup
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [showLoserPopup, setShowLoserPopup] = useState(false);

  useEffect(() => {
    if (location.state?.status === "winner") {
      setShowWinnerPopup(true);
    } else if (location.state?.status === "loser") {
      setShowLoserPopup(true);
    }
  }, [location.state]);

  // ฟังก์ชันกลับไปยังหน้าก่อนหน้า
  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <>
      {/* Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>

      {/* กรณีไม่มี auction_id */}
      {idError ? (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 pt-[100px]">
          <div className="bg-red-100 border border-red-400 text-red-700 p-8 rounded-lg shadow-md text-center max-w-md">
            <h2 className="text-xl font-bold mb-4">เกิดข้อผิดพลาด</h2>
            <p className="mb-6">{error}</p>
            <button
              onClick={() => navigate("/auction")}
              className="px-5 py-3 bg-red-600 text-white rounded-lg"
            >
              กลับไปหน้าประมูล
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 pt-[100px] relative">
          {/* ปุ่มย้อนกลับ */}
          <div className="self-start mb-4">
            <button
              className="flex items-center text-gray-700 px-4 py-2 rounded-full border"
              onClick={navigateBack}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              ย้อนกลับ
            </button>
          </div>

          {/* แสดง error ถ้ามี */}
          {error && !idError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 w-full max-w-[850px]">
              {error}
            </div>
          )}

          {/* แสดง loading ถ้ากำลังโหลด */}
          {isLoading && (
            <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-40">
              <div className="bg-white p-5 rounded-lg shadow-lg">
                <p className="text-lg">กำลังโหลดข้อมูล...</p>
                <div className="animate-spin h-10 w-10 border-4 border-purple-500 rounded-full border-t-transparent mt-2"></div>
              </div>
            </div>
          )}

          {/* Popup อยู่บนสุด */}
          {showWinnerPopup && (
            <div className="fixed inset-0 z-50 flex justify-center items-center">
              <WinnerPopup 
                onClose={() => setShowWinnerPopup(false)} 
                auction_id={auctionId} 
              />
            </div>
          )}
          {showLoserPopup && (
            <div className="fixed inset-0 z-50 flex justify-center items-center">
              <LoserPopup 
                rank={selectedBidder?.rank || 0} 
                onClose={() => setShowLoserPopup(false)} 
                auction_id={auctionId}
              />
            </div>
          )}

          <BidAuctionHeader 
            auctioneer={auctionInfo?.auctioneer_name || auctioneer} 
            timeLeft={timeLeft} 
          />
          <BidAuctionList bidders={bidders} />
          <BidAuctionFooter 
            selectedBidder={selectedBidder} 
            bidders={bidders} 
            setBidders={setBidders} 
            currentRank={currentRank}
            setCurrentRank={setCurrentRank}
            bidderCoins={bidderCoins}
            setBidderCoins={setBidderCoins}
            updateRankings={updateRankings}
            fetchBidders={fetchBidders}
            getApiBaseUrl={() => API_BASE_URL}
            auction_id={auctionId}
            userCoins={userCoins}
            setUserCoins={setUserCoins}
            auctionInfo={auctionInfo}
            currentUser={currentUser}
          />
        </div>
      )}
    </>
  );
};

export default BidAuction;