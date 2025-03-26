import React from "react";
import Images from "../../../assets";

const BidAuctionList = ({ bidders }) => {
  const myUsername = "แ*********"; // ชื่อของตัวเอง

  // ตรวจสอบว่ามีผู้ประมูลหรือไม่
  const hasBidders = bidders && bidders.length > 0;
  
  // กรองเฉพาะผู้ที่มีการประมูล (coins > 0)
  const activeBidders = hasBidders 
    ? bidders.filter(bid => bid.coins > 0)
      .sort((a, b) => b.coins - a.coins) // เรียงจากมากไปน้อย
    : [];
    
  // ผู้ที่ยังไม่ได้ประมูล
  const inactiveBidders = hasBidders 
    ? bidders.filter(bid => bid.coins === 0)
    : [];
  
  // รวมผู้ประมูลทั้งหมดโดยเรียงลำดับใหม่
  const sortedBidders = [...activeBidders, ...inactiveBidders];

  return (
    <div className="mt-6 w-full max-w-2xl mx-auto pb-24">
      {/* แสดงข้อความเมื่อยังไม่มีผู้ประมูล */}
      {activeBidders.length === 0 && (
        <div className="text-center text-gray-500 py-3 bg-white rounded-lg shadow-md mb-4">
          <p className="font-medium">ยังไม่มีผู้ประมูลในขณะนี้</p>
          <p className="text-sm mt-1">คุณสามารถเป็นผู้ประมูลคนแรกได้!</p>
        </div>
      )}
      
      {/* แสดงรายการผู้ประมูล */}
      {sortedBidders.map((bid, index) => {
        const isMyBid = bid.username === myUsername;
        const isActive = bid.coins > 0;
        
        return (
          <div
            key={bid.id || index}
            className={`flex justify-between items-center px-4 py-3 rounded-lg mb-2 ${
              isMyBid 
                ? "bg-[#5A189A] text-white" // สีเข้มกว่าสำหรับตัวเอง
                : isActive 
                  ? "bg-[#8677A7] text-white" // สีปกติสำหรับผู้ประมูลคนอื่น
                  : "bg-gray-300 text-gray-600" // สีจางสำหรับผู้ที่ยังไม่ได้ประมูล
            } relative transition-colors duration-300`}
          >
            {/* แถบด้านข้างเพื่อแสดงว่านี่คือรายการของเรา */}
            {isMyBid && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 rounded-l-lg"></div>
            )}
            
            {/* อันดับ + โปรไฟล์ */}
            <div className="flex items-center gap-3 relative">
              {/* มงกุฎ & ตำแหน่ง */}
              {isActive ? (
                index === 0 ? (
                  <div className="relative">
                    <img src={Images.CrownOne} alt="Winner" className="w-7 h-7" />
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                      1
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <img src={Images.CrownTwo} alt="Rank" className="w-6 h-6 opacity-80" />
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </span>
                  </div>
                )
              ) : (
                <div className="relative">
                  <img src={Images.CrownTwo} alt="Rank" className="w-6 h-6 opacity-30" />
                  <span className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-lg">
                    -
                  </span>
                </div>
              )}

              {/* รูปโปรไฟล์ */}
              <img
                src={isMyBid ? Images.profilemam : Images.profileWoman}
                alt="Profile"
                className={`w-10 h-10 rounded-full border-2 ${
                  isMyBid ? "border-yellow-400" : "border-white"
                }`}
              />

              {/* ชื่อผู้ใช้ */}
              <div className="text-sm">
                <p className="font-bold">{bid.username}</p>
                <p className="text-xs opacity-80">{bid.hiddenUser}</p>
                {isMyBid && (
                  <span className="text-xs bg-yellow-400 text-black px-1 rounded">คุณ</span>
                )}
              </div>
            </div>

            {/* จำนวน Coins */}
            <div className="flex items-center gap-2">
              {/* พื้นหลัง Radial ของถ้วยรางวัล */}
              <div className={`w-10 h-10 rounded-full ${
                isActive 
                  ? "bg-gradient-to-r from-[#FFF9E2] to-[#FFF5D1]" 
                  : "bg-gray-200"
              } flex items-center justify-center`}>
                {/* ไอคอนถ้วยรางวัล */}
                <img 
                  src={Images.trophy} 
                  alt="Coins" 
                  className={`w-5 h-5 ${!isActive && "opacity-50"}`} 
                />
              </div>

              {/* จำนวน Coins */}
              <p className="text-sm font-semibold">
                {isActive ? `${bid.coins} Coins` : "-"}
              </p>
            </div>
          </div>
        );
      })}
      
      {/* แสดงข้อความแนะนำท้ายรายการ */}
      <div className="text-center text-gray-500 text-xs mt-2">
        เริ่มต้นประมูลที่ {sortedBidders.length > 0 && activeBidders.length > 0 
          ? `${activeBidders[0].coins + 50} coins` 
          : "50 coins"}
      </div>
    </div>
  );
};

export default BidAuctionList;