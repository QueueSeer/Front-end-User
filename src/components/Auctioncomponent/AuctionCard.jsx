import React from "react";
import { useNavigate } from "react-router-dom";

const AuctionCard = ({ auction }) => {
  const navigate = useNavigate();

  // แปลงวันที่สร้างประมูลเป็นรูปแบบที่อ่านง่าย
  const formattedCreatedDate = auction.dateCreated 
    ? new Date(auction.dateCreated).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : "ไม่ระบุวันที่";

  return (
    <div
      className="bg-white rounded-lg shadow-md max-w-sm overflow-hidden cursor-pointer"
      onClick={() => navigate(`/detailAuction/${auction.id}`, { state: { auction } })}
    >
      {/* รูปภาพของการ์ด */}
      <div className="w-full h-60 overflow-hidden">
        <img
          src={auction.image}
          alt={auction.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* เนื้อหาของการ์ด */}
      <div className="p-4">
        <p className="text-purple-700 text-xs font-medium">{auction.startDate}</p>
        <h3 className="font-semibold text-lg mt-1">{auction.title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {auction.description}
        </p>

        {/* ข้อมูลหมอดู + วันที่ */}
        <div className="flex justify-between items-center mt-4 border-t pt-2">
          <div className="flex items-center">
            <img
              src={auction.profileImage}
              alt={auction.astrologer}
              className="w-8 h-8 rounded-full"
            />
            <p className="text-sm font-medium ml-2">{auction.astrologer}</p>
          </div>
          <p className="text-xs text-gray-500 text-right">วันที่ {formattedCreatedDate}</p>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;