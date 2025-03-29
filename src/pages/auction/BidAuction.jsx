import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BidAuctionHeader from "../../components/Auctioncomponent/ฺBid/BidAuctionHeader";
import BidAuctionList from "../../components/Auctioncomponent/ฺBid/BidAuctionList";
import BidAuctionFooter from "../../components/Auctioncomponent/ฺBid/BidAuctionFooter";
import WinnerPopup from "../../components/Auctioncomponent/ฺBid/WinnerPopup";
import LoserPopup from "../../components/Auctioncomponent/ฺBid/LoserPopup";
import Navbar from "../../components/navbar";

const BidAuction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auction_id } = useParams();
  const auctionId = auction_id || location.state?.auction_id;
  const updatedCoins = location.state?.updatedCoins || 0;
  
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

  const [bidders, setBidders] = useState([
    { id: 1, username: "ร*********", hiddenUser: "JaiJup*****", coins: 100, rank: 1 },
    { id: 2, username: "ร*********", hiddenUser: "Rajir*****", coins: 90, rank: 2 },
    { id: 3, username: "แ*********", hiddenUser: "Manmkiti64", coins: 85, rank: 3 },
    { id: 4, username: "บ*********", hiddenUser: "punra*****", coins: 80, rank: 4 },
    { id: 5, username: "ร*********", hiddenUser: "punra*****", coins: 70, rank: 5 },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auctionInfo, setAuctionInfo] = useState({
    initial_bid: initialBidFromState,
    min_increment: minIncrementFromState,
    auctioneer_name: auctioneerNameFromState
  });
  const [currentRank, setCurrentRank] = useState("3");
  const [bidderCoins, setBidderCoins] = useState(85);
  const [userCoins, setUserCoins] = useState(0); // จำนวน coins ของผู้ใช้
  const [apiConnected, setApiConnected] = useState(true); // สถานะการเชื่อมต่อกับ API

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

  // API URL ที่ถูกต้อง - ใช้ path สัมพัทธ์
  const getApiBaseUrl = () => {
    return '/api';
  };

  // ฟังก์ชันดึงข้อมูลผู้ใช้จาก API
  const fetchUserInfo = async () => {
    if (!apiConnected) return; // ไม่เรียก API ถ้าพบว่าไม่สามารถเชื่อมต่อได้

    try {
      const response = await axios.get(`${getApiBaseUrl()}/user/me`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Accept': 'application/json'
        },
        withCredentials: true,
        timeout: 10000 // เพิ่ม timeout เพื่อป้องกัน hanging request
      });
      
      if (response.data && response.data.coins !== undefined) {
        setUserCoins(response.data.coins);
        console.log("User coins fetched:", response.data.coins);
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      
      // ถ้าไม่สามารถเชื่อมต่อกับ API ได้ (500 error)
      if (err.response && err.response.status === 500) {
        setApiConnected(false);
        // ใช้ข้อมูลจำลองแทน
        console.log("Using mock data due to API connection failure");
        setUserCoins(500); // ใช้ค่าเริ่มต้นเป็น 500 coins
      }
    }
  };

  // ฟังก์ชันดึงข้อมูลผู้ประมูลจาก API
  const fetchBidders = async () => {
    if (!auctionId || !apiConnected) {
      if (!auctionId) console.error("Missing auction_id, cannot fetch bidders");
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await axios.get(`${getApiBaseUrl()}/auction/${auctionId}/bids`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Accept': 'application/json'
        },
        withCredentials: true,
        timeout: 10000 // เพิ่ม timeout
      });
      
      console.log("API Response:", response.data);
      
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
        
        if (bidsArray.length === 0) {
          console.warn("Response is not an array and no array field found:", response.data);
          if (response.status === 304) {
            setIsLoading(false);
            return; // ใช้ข้อมูลเดิมที่ cache ไว้
          }
        }
      }
      
      // ถ้าไม่มีข้อมูลจาก API ใช้ข้อมูลเริ่มต้น
      if (bidsArray.length === 0) {
        setIsLoading(false);
        return;
      }
      
      // แยกผู้ที่มีการลงเงินและยังไม่ได้ลงเงิน
      const activeBids = bidsArray.filter(bid => bid.amount > 0);
      const zeroBids = bidsArray.filter(bid => bid.amount === 0);
      
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
      
      // อัปเดตข้อมูลของ selectedBidder
      const selectedBidder = fetchedBidders.find(b => b.username === "แ*********");
      if (selectedBidder) {
        setBidderCoins(selectedBidder.coins);
        setCurrentRank(selectedBidder.rank.toString());
      }
      
      setError(null); // ล้าง error ถ้าดึงข้อมูลสำเร็จ
      
    } catch (err) {
      console.error("Error fetching bidders:", err);
      
      // ถ้าไม่สามารถเชื่อมต่อกับ API ได้ (500 error)
      if (err.response && err.response.status === 500) {
        setApiConnected(false);
        setError("เซิร์ฟเวอร์ไม่ตอบสนอง กำลังใช้ข้อมูลจำลอง");
      } else {
        setError("ไม่สามารถดึงข้อมูลผู้ประมูลได้");
      }
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
    const selectedBidder = updatedBidders.find(b => b.username === "แ*********");
    
    // อัปเดตจำนวน coins ของผู้ใช้ปัจจุบัน
    if (currentUserIndex !== -1) {
      updatedBidders[currentUserIndex].coins = newCoins;
    } else if (selectedBidder) {
      // ถ้าไม่พบผู้ใช้ในรายการ ให้เพิ่มเข้าไป
      updatedBidders.push({
        ...selectedBidder,
        id: currentUserId,
        coins: newCoins
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
    if (!auctionId || !apiConnected) {
      if (!auctionId) console.error("Missing auction_id, cannot fetch auction info");
      return;
    }

    try {
      const response = await axios.get(`${getApiBaseUrl()}/auction/${auctionId}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Accept': 'application/json'
        },
        withCredentials: true,
        timeout: 10000 // เพิ่ม timeout
      });
      
      const data = response.data;
      setAuctionInfo({
        ...auctionInfo,
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
      
      // ถ้าไม่สามารถเชื่อมต่อกับ API ได้ (500 error)
      if (err.response && err.response.status === 500) {
        setApiConnected(false);
        
        // ใช้ค่าจำลองสำหรับเวลาสิ้นสุด (1 วันจากปัจจุบัน)
        const mockEndTime = new Date();
        mockEndTime.setDate(mockEndTime.getDate() + 1);
        updateTimeLeft(mockEndTime.toISOString());
        
        setError("เซิร์ฟเวอร์ไม่ตอบสนอง กำลังใช้ข้อมูลจำลอง");
      } else {
        setError("ไม่สามารถดึงข้อมูลการประมูลได้");
      }
    }
  };

  // ฟังก์ชันอัปเดตเวลาที่เหลือ
  const updateTimeLeft = (endTimeStr) => {
    const endTime = new Date(endTimeStr).getTime();
    
    // อัปเดตเวลาทุกวินาที
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;
      
      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft([
          { label: "วัน", value: "0" },
          { label: "ชั่วโมง", value: "0" },
          { label: "นาที", value: "0" },
          { label: "วินาที", value: "0" }
        ]);
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft([
        { label: "วัน", value: days.toString() },
        { label: "ชั่วโมง", value: hours.toString() },
        { label: "นาที", value: minutes.toString() },
        { label: "วินาที", value: seconds.toString() }
      ]);
    }, 1000);
    
    // ล้าง timer เมื่อ component unmount
    return () => clearInterval(timer);
  };

  // ใช้ Server-Sent Events (SSE) หรือ polling ตามความเหมาะสม
  useEffect(() => {
    if (!auctionId) {
      console.error("Missing auction_id, cannot initialize data fetching");
      return;
    }
    
    // ดึงข้อมูลเริ่มต้น
    fetchAuctionInfo();
    fetchBidders();
    fetchUserInfo(); // ดึงข้อมูลผู้ใช้และจำนวน coins
    
    let eventSource;
    let pollingInterval;
    
    // ลองใช้ SSE ก่อน
    try {
      if (apiConnected) {
        eventSource = new EventSource(`${getApiBaseUrl()}/auction/${auctionId}/bids/stream?times=600`);
        
        // เมื่อได้รับข้อมูลใหม่
        eventSource.onmessage = (event) => {
          console.log("SSE received data:", event.data);
          
          try {
            const data = JSON.parse(event.data);
            
            // ตรวจสอบว่าข้อมูลเป็นอาร์เรย์
            if (Array.isArray(data)) {
              // แยกผู้ประมูลตามจำนวนเงิน
              const activeBids = data.filter(bid => bid.amount > 0);
              const zeroBids = data.filter(bid => bid.amount === 0);
              
              // เรียงลำดับผู้ที่ลงเงินแล้ว
              const sortedActiveBids = [...activeBids].sort((a, b) => b.amount - a.amount);
              
              // สร้าง bidders ที่มีการลงเงินแล้ว
              const activeBidders = sortedActiveBids.map((bid, index) => ({
                id: bid.user_id,
                username: bid.username || `User${bid.user_id}`,
                hiddenUser: bid.hidden_username || `User${bid.user_id.toString().substr(-4)}`,
                coins: bid.amount,
                rank: index + 1
              }));
              
              // สร้าง bidders ที่ยังไม่ได้ลงเงิน
              const lastRank = activeBidders.length > 0 ? activeBidders.length : 0;
              const zeroBidders = zeroBids.map(bid => ({
                id: bid.user_id,
                username: bid.username || `User${bid.user_id}`,
                hiddenUser: bid.hidden_username || `User${bid.user_id.toString().substr(-4)}`,
                coins: 0,
                rank: lastRank + 1
              }));
              
              // รวมและอัปเดต bidders
              const updatedBidders = [...activeBidders, ...zeroBidders];
              setBidders(updatedBidders);
              
              // อัปเดตข้อมูลของ selectedBidder
              const selectedBidder = updatedBidders.find(b => b.username === "แ*********");
              if (selectedBidder) {
                setBidderCoins(selectedBidder.coins);
                setCurrentRank(selectedBidder.rank.toString());
              }
            }
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
          
          // สลับไปใช้ polling แทน
          setApiConnected(false);
          
          // ตั้งเวลาดึงข้อมูลทุก 10 วินาที
          pollingInterval = setInterval(() => {
            if (!isLoading) {
              fetchBidders();
              // อัปเดต user coins ทุก 30 วินาที
              if (Math.random() < 0.3) fetchUserInfo();
            }
          }, 10000);
        };
      } else {
        // ถ้าไม่สามารถใช้ SSE ได้ ให้ใช้ polling แทน
        pollingInterval = setInterval(() => {
          if (!isLoading) {
            fetchBidders();
            // อัปเดต user coins ทุก 30 วินาที
            if (Math.random() < 0.3) fetchUserInfo();
          }
        }, 10000);
      }
    } catch (err) {
      console.error("Error initializing SSE:", err);
      
      // ใช้การโหลดข้อมูลแบบปกติแทน
      setApiConnected(false);
      
      // ตั้งเวลาดึงข้อมูลทุก 10 วินาที
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
      console.log("Closing SSE connection");
      if (eventSource) {
        eventSource.close();
      }
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [auctionId, apiConnected]);

  // หาอันดับของ "แ*********" ในลิสต์
  const selectedBidder = bidders.find((bidder) => bidder.username === "แ*********") || bidders[2];

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

  // ฟังก์ชันกลับไปยังหน้า AuctionDetails
  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <>
      {/* Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>

      {/* ปุ่มย้อนกลับ และ แสดง error กรณีไม่มี ID */}
      {idError ? (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 pt-[100px]">
          <div className="bg-red-100 border border-red-400 text-red-700 p-8 rounded-lg shadow-md text-center max-w-md">
            <h2 className="text-xl font-bold mb-4">เกิดข้อผิดพลาด</h2>
            <p className="mb-6">{error}</p>
            <button
              onClick={() => navigate("/homepage")}
              className="px-5 py-3 bg-red-600 text-white rounded-lg"
            >
              กลับไปหน้าแรก
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

          {/* แสดง API Connection Status */}
          {!apiConnected && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded relative mb-4 w-full max-w-[850px]">
              เซิร์ฟเวอร์ไม่ตอบสนอง กำลังใช้ข้อมูลจำลอง
            </div>
          )}

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
              <WinnerPopup onClose={() => setShowWinnerPopup(false)} />
            </div>
          )}
          {showLoserPopup && (
            <div className="fixed inset-0 z-50 flex justify-center items-center">
              <LoserPopup rank={selectedBidder?.rank || 3} onClose={() => setShowLoserPopup(false)} />
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
            getApiBaseUrl={getApiBaseUrl}
            auction_id={auctionId}
            userCoins={userCoins}
            setUserCoins={setUserCoins}
            auctionInfo={auctionInfo}
            apiConnected={apiConnected}
          />
        </div>
      )}
    </>
  );
};

export default BidAuction;