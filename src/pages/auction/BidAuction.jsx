import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BidAuctionHeader from "../../components/Auctioncomponent/ฺBid/BidAuctionHeader";
import BidAuctionList from "../../components/Auctioncomponent/ฺBid/BidAuctionList";
import BidAuctionFooter from "../../components/Auctioncomponent/ฺBid/BidAuctionFooter";
import WinnerPopup from "../../components/Auctioncomponent/ฺBid/WinnerPopup"; // ✅ Import Popup ชนะ
import LoserPopup from "../../components/Auctioncomponent/ฺBid/LoserPopup"; // ✅ Import Popup แพ้

const BidAuction = () => {
  const location = useLocation();
  const updatedCoins = location.state?.updatedCoins || 0; // ✅ รับค่าที่อัปเดตจาก SummaryPage

  const auctioneer = "หมอดู เพียงฟ้า พาพิชัย";

  const timeLeft = [
    { label: "วัน", value: "0" },
    { label: "ชั่วโมง", value: "0" },
    { label: "นาที", value: "1" },
    { label: "วินาที", value: "29" }
  ];

  //  สร้าง state สำหรับจัดเก็บอันดับใหม่
  const [bidders, setBidders] = useState([
    { username: "ร*********", hiddenUser: "JaiJup*****", coins: 9300 },
    { username: "ร*********", hiddenUser: "Rajir*****", coins: 8900 },
    { username: "บ*********", hiddenUser: "punra*****", coins: 7010 },
    { username: "ร*********", hiddenUser: "punra*****", coins: 7000 },
    { username: "แ*********", hiddenUser: "Manmkiti64", coins: 6990 }, // ✅ คำนวณอันดับใหม่ให้ Manmkiti64
    { username: "ค*********", hiddenUser: "Rajir*****", coins: 6940 },
    { username: "ภ*********", hiddenUser: "roj*****", coins: 6930 },
    { username: "ฐ*********", hiddenUser: "ฐู*********", coins: 6910 }
  ]);

  //  อัปเดตอันดับของ selectedBidder เมื่อ updatedCoins เปลี่ยน
  useEffect(() => {
    if (updatedCoins > 0) {
      setBidders((prevBidders) => {
        const newBidders = prevBidders.map((bidder) =>
          bidder.username === "แ*********" ? { ...bidder, coins: updatedCoins } : bidder
        );

        //  เรียงลำดับใหม่ตาม Coins
        newBidders.sort((a, b) => b.coins - a.coins);

        return newBidders;
      });
    }
  }, [updatedCoins]);

  //  หาอันดับของ "แ*********" ในลิสต์
  const selectedBidder = bidders.find((bidder) => bidder.username === "แ*********") || bidders[4];

  //  เช็คสถานะจาก `location.state` เพื่อแสดง Popup
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [showLoserPopup, setShowLoserPopup] = useState(false);

  useEffect(() => {
    if (location.state?.status === "winner") {
      setShowWinnerPopup(true);
    } else if (location.state?.status === "loser") {
      setShowLoserPopup(true);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 relative">
      {/*  Popup อยู่บนสุด */}
      {showWinnerPopup && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <WinnerPopup onClose={() => setShowWinnerPopup(false)} />
        </div>
      )}
      {showLoserPopup && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <LoserPopup rank={3} onClose={() => setShowLoserPopup(false)} />
        </div>
      )}

      <BidAuctionHeader auctioneer={auctioneer} timeLeft={timeLeft} />
      <BidAuctionList bidders={bidders} />
      <BidAuctionFooter selectedBidder={selectedBidder} bidders={bidders} setBidders={setBidders} />
    </div>
  );
};

export default BidAuction;
