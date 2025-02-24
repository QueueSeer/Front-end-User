import React, { useState } from "react";
import Images from "../../../assets";
import { useNavigate } from "react-router-dom";
import LuckCard from "../../TopupComponent/LuckCard"; // ✅ นำเข้า LuckCard

const BidAuctionFooter = ({ selectedBidder, bidders, setBidders }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [bidAmount, setBidAmount] = useState(50);
  
  // ✅ เพิ่ม state สำหรับ Coins ใน LuckCard
  const [userCoins, setUserCoins] = useState(85);
  
  // ✅ เพิ่ม state สำหรับ Coins ของผู้ประมูล (เริ่มต้นที่ 0)
  const [bidderCoins, setBidderCoins] = useState(85);

  const handleIncrease = () => {
    setBidAmount((prev) => Math.min(prev + 50, 200));
  };

  const handleDecrease = () => {
    setBidAmount((prev) => Math.max(prev - 50, 50));
  };

  const handleBid = () => {
    if (userCoins >= bidAmount) {
      // ✅ ลด Coins ของผู้ใช้
      setUserCoins((prev) => prev - bidAmount);

      // ✅ อัปเดต Coins ของผู้ประมูล
      const updatedBidderCoins = bidderCoins + bidAmount;
      setBidderCoins(updatedBidderCoins);

      // ✅ อัปเดตลิสต์ของผู้ประมูลและจัดอันดับใหม่
      const updatedBidders = bidders.map((bidder) =>
        bidder.username === selectedBidder.username
          ? { ...bidder, coins: updatedBidderCoins }
          : bidder
      );

      updatedBidders.sort((a, b) => b.coins - a.coins);
      setBidders(updatedBidders);

      setIsExpanded(false);
    } else {
      alert("Coins ไม่พอสำหรับลงเงิน กรุณาเติมโชค Coin!");
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[80%] max-w-[850px] bg-gray-200 shadow-lg rounded-t-lg transition-all duration-300">
      <button
        className="flex justify-center w-full py-2 bg-[#E4E4E6] rounded-t-lg cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <img src={isExpanded ? Images.down : Images.ArrowUp} alt="Toggle" className="w-4 h-4" />
      </button>

      <div className="flex justify-between items-center px-8 py-4 mx-6 bg-[#77599A] rounded-lg text-white relative shadow-md">
        <div className="flex items-center gap-5">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <img src={Images.CrownTwo} alt="Rank" className="w-full h-full" />
            <span className="absolute text-sm font-bold text-white">
              {selectedBidder?.rank ?? "3"}
            </span>
          </div>

          <img src={Images.profilemam} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white" />
          <div>
            <p className="text-sm font-semibold">{selectedBidder.username}</p>
            <p className="text-xs text-gray-300">{selectedBidder.hiddenUser}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FFF9E2] to-[#FFF5D1] flex items-center justify-center shadow-md">
            <img src={Images.trophy} alt="Coins" className="w-6 h-6" />
          </div>
          <p className="text-lg font-semibold">{bidderCoins} Coins</p> {/* ✅ อัปเดต Coins ของผู้ประมูล */}
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gray-200 px-6 py-5 rounded-b-lg shadow-lg">
          {/* ✅ ใช้ grid grid-cols-2 เพื่อให้ LuckCard และ Coins อยู่ในบรรทัดเดียวกัน */}
          <div className="grid grid-cols-2 gap-5 items-center">
            {/* ✅ LuckCard - ปรับขนาดให้ไม่เลื่อนผิดที่ */}
            <div className="w-full">
              <LuckCard coins={userCoins} showTopUp={true} />
            </div>

            {/* ✅ ส่วนเลือก Coins */}
            <div className="bg-white p-5 rounded-lg shadow-md flex flex-col justify-between">
              <div className="flex justify-between text-gray-700 text-sm">
                <p>50 Coins น้อยที่สุด</p>
                <p>200 Coins มากที่สุด</p>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  className="bg-[#5A189A] text-white w-9 h-9 flex items-center justify-center rounded-full"
                  onClick={handleDecrease}
                >
                  −
                </button>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="50"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="w-full"
                />
                <button
                  className="bg-[#5A189A] text-white w-9 h-9 flex items-center justify-center rounded-full"
                  onClick={handleIncrease}
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
            >
              <img src={Images.back} alt="Back" className="w-5 h-5 mr-1" />
              หน้าหลัก
            </button>

            <button className="bg-[#77599A] text-white py-2 px-8 rounded-full font-medium shadow-md" onClick={handleBid}>
              ลงเงิน
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidAuctionFooter;
