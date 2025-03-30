import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import images from "../../assets";

const OngoingAuctions = ({ auctions = [] }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [displayAuctions, setDisplayAuctions] = useState(auctions);

  // Update display auctions when auctions prop changes
  useEffect(() => {
    setDisplayAuctions(auctions);
  }, [auctions]);

  // ✅ เริ่มลาก Scroll
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // ✅ ฟังก์ชันนำทางเมื่อกด "รายละเอียด"
const handleAuctionDetail = (auction) => {
  if (auction.timeLeft !== "00:00:00:00") {
    // ✅ การประมูลยังไม่จบ → ไปที่ `BidAuction` ปกติ
    navigate(`/bidAuction/${auction.id}`, { 
      state: { auctionId: auction.id } 
    });
  } else {
    // ✅ การประมูลจบ → เช็คว่าชนะหรือแพ้
    if (auction.isWinner) {
      // ✅ ชนะ → ไป `BidAuction` พร้อม Pop-up แสดงความยินดี
      navigate(`/bidAuction/${auction.id}`, { 
        state: { auctionId: auction.id, status: "winner" } 
      });
    } else {
      // ✅ แพ้ → ไป `BidAuction` พร้อม Pop-up บอกอันดับ
      navigate(`/bidAuction/${auction.id}`, { 
        state: { auctionId: auction.id, status: "loser" } 
      });
    }
  }
};

  // ✅ อัปเดตเวลาถอยหลังทุกวินาที
  useEffect(() => {
    // ฟังก์ชันสำหรับอัปเดตเวลา (เฉพาะเวลาจำลอง - ไม่ใช่การคำนวณจริง)
    const updateTimers = () => {
      setDisplayAuctions(prevAuctions => {
        return prevAuctions.map(auction => {
          // ถ้าเวลาหมดแล้ว ไม่ต้องอัปเดต
          if (auction.timeLeft === "00:00:00:00") {
            return auction;
          }
          
          // จำลองการลดเวลาลง (อันนี้เป็นตัวอย่างเท่านั้น)
          // ในกรณีจริง ควรคำนวณจาก end_time - current_time
          const [days, hours, minutes, seconds] = auction.timeLeft.split(':').map(Number);
          let newSeconds = seconds - 1;
          let newMinutes = minutes;
          let newHours = hours;
          let newDays = days;
          
          if (newSeconds < 0) {
            newSeconds = 59;
            newMinutes -= 1;
          }
          
          if (newMinutes < 0) {
            newMinutes = 59;
            newHours -= 1;
          }
          
          if (newHours < 0) {
            newHours = 23;
            newDays -= 1;
          }
          
          // ถ้าเวลาหมด
          if (newDays < 0) {
            return {
              ...auction,
              timeLeft: "00:00:00:00"
            };
          }
          
          const newTimeLeft = `${String(newDays).padStart(2, '0')}:${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
          
          return {
            ...auction,
            timeLeft: newTimeLeft
          };
        });
      });
    };
    
    // ตั้ง interval เพื่ออัปเดตเวลาทุกวินาที
    const timerInterval = setInterval(updateTimers, 1000);
    
    // ล้าง interval เมื่อ component unmount
    return () => clearInterval(timerInterval);
  }, []);

  // ✅ ถ้าไม่มีการประมูล ไม่ต้องแสดงอะไร
  if (displayAuctions.length === 0) {
    return null;
  }

  return (
    <div className="p-6 md:p-12">
      <div className="flex items-center mb-4">
        <span className="w-2 h-6 bg-purple-700 mr-2"></span>
        <h2 className="text-2xl font-bold text-gray-900">กำลังเข้าร่วม</h2>
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto whitespace-nowrap cursor-grab active:cursor-grabbing scrollbar-hide"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ userSelect: "none", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>
          {`
            ::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        <div className="flex gap-6">
          {displayAuctions.map((auction) => (
            <div
              key={auction.id}
              className="bg-gradient-to-b from-purple-300 to-purple-800 p-6 rounded-lg shadow-lg relative text-white min-w-[320px] w-[33%] flex-shrink-0"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">{auction.title}</h3>
                <button className="bg-pink-400 px-4 py-1 rounded-lg text-sm font-bold">
                  ปิดลำดับของคุณ
                </button>
              </div>

              <p className="text-sm mt-2">{auction.description}</p>

              {/* ✅ ตัวนับเวลาถอยหลัง พร้อม `:` คั่น */}
              <div className="flex justify-start text-3xl font-bold mt-4">
                {auction.timeLeft.split(":").map((time, index, arr) => (
                  <div key={index} className="flex items-center">
                    <span className="bg-white text-purple-800 px-4 py-2 rounded mx-1">
                      {time}
                    </span>
                    {index !== arr.length - 1 && <span className="text-white mx-1">:</span>}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <img 
                    src={auction.seerImage || images.profileSmall} 
                    alt="seer" 
                    className="w-8 h-8 rounded-full mr-2" 
                  />
                  <p className="text-sm">{auction.seerName}</p>
                </div>
                <button
                  className="text-white text-sm flex items-center"
                  onClick={() => handleAuctionDetail(auction)}
                >
                  รายละเอียด <span className="ml-1">›</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OngoingAuctions;