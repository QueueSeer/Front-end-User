import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import AuctionHeader from "../../components/Auctioncomponent/Detail/AuctionHeader";
import AuctionInfoBox from "../../components/Auctioncomponent/Detail/AuctionInfoBox";
import AuctionDetailSection from "../../components/Auctioncomponent/Detail/AuctionDetailSection";
import ProfileCard from "../../components/Profilecomponent/ProfileCard";

const DetailAuction = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const auction = location.state?.auction;

  if (!auction) {
    return <p className="text-center text-gray-500">ไม่พบข้อมูลประมูล</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* ส่วนหัว */}
        <AuctionHeader auction={auction} onBack={() => navigate(-1)} />

        {/* กล่องข้อมูลหลัก */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
          <AuctionInfoBox auction={auction} />
          <AuctionDetailSection auction={auction} />
          <div className="w-2/3 mt-6">
          <p className="text-lg font-bold border-l-4 border-[#8677A7] pl-3 mb-2">โดย</p>
          <ProfileCard astrologer={auction.astrologer} />
        </div>
        </div>

      
      </div>
    </div>
  );
};

export default DetailAuction;
