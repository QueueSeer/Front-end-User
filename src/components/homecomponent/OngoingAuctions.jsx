import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import images from "../../assets";

const OngoingAuctions = ({ auctions }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
      navigate("/bidAuction", { state: { auctionId: auction.id } });
    } else {
      // ✅ การประมูลจบ → เช็คว่าชนะหรือแพ้
      if (auction.isWinner) {
        // ✅ ชนะ → ไป `BidAuction` พร้อม Pop-up แสดงความยินดี
        navigate("/bidAuction", { state: { auctionId: auction.id, status: "winner" } });
      } else {
        // ✅ แพ้ → ไป `BidAuction` พร้อม Pop-up บอกอันดับ
        navigate("/bidAuction", { state: { auctionId: auction.id, status: "loser" } });
      }
    }
  };

  return (
    <div className="p-12">
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
          {auctions.map((auction) => (
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
                  <img src={images.profileSmall} alt="seer" className="w-8 h-8 rounded-full mr-2" />
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
