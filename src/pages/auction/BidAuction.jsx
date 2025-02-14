import React from "react";
import BidAuctionHeader from "../../components/Auctioncomponent/ฺBid/BidAuctionHeader";
import BidAuctionList from "../../components/Auctioncomponent/ฺBid/BidAuctionList";
import BidAuctionFooter from "../../components/Auctioncomponent/ฺBid/BidAuctionFooter";

const BidAuction = () => {
  const auctioneer = "หมอดู เพียงฟ้า พาพิชัย";
  
  const timeLeft = [
    { label: "วัน", value: "0" },
    { label: "ชั่วโมง", value: "0" },
    { label: "นาที", value: "1" },
    { label: "วินาที", value: "29" }
  ];

  const bidders = [
    { username: "ร*********", hiddenUser: "JaiJup*****", coins: "9,300" },
    { username: "ร*********", hiddenUser: "Rajir*****", coins: "8,900" },
    { username: "บ*********", hiddenUser: "punra*****", coins: "7,010" },
    { username: "ร*********", hiddenUser: "punra*****", coins: "7,000" },
    { username: "แ*********", hiddenUser: "Manmkiti64", coins: "6,990" },
    { username: "ค*********", hiddenUser: "Rajir*****", coins: "6,940" },
    { username: "ภ*********", hiddenUser: "roj*****", coins: "6,930" },
    { username: "ฐ*********", hiddenUser: "ฐู*********", coins: "6,910" }
  ];

  const selectedBidder = bidders[4]; // อันดับที่ 5

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <BidAuctionHeader auctioneer={auctioneer} timeLeft={timeLeft} />
      <BidAuctionList bidders={bidders} />
      <BidAuctionFooter selectedBidder={selectedBidder} />
    </div>
  );
};

export default BidAuction;
