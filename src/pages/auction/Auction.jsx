import React, { useState } from "react";
import Images from "../../assets";
import AuctionSearchBar from "../../components/Auctioncomponent/AuctionSearchBar";
import AuctionCard from "../../components/Auctioncomponent/AuctionCard";
import Pagination from "../../components/Auctioncomponent/Pagination";
import Navbar from "../../components/navbar"; // เรียกใช้ path ที่ถูกต้อง

const Auction = () => {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [page3, setPage3] = useState(1);
  const totalPages = 10;

  const auctions = [
    {
      id: 1,
      image: Images.auctionImages,
      title: "ดูดวงความรัก สุขภาพ การงาน ภาพรวม",
      description:
        "ดูดวงรายวัน ความรัก สุขภาพ การงาน ภาพรวมประจำวัน อ่านและฟังผ่านหน้าเว็บไซต์ของเราชื่อดังระดับประเทศ",
      startDate: "24 ตุลาคม 2567 เวลา 14.00 น.",
      profileImage: Images.profileSmall,
      astrologer: "หมอดู เพียงฟ้า",
    },
    {
      id: 2,
      image: Images.auctionImages,
      title: "ดูดวงความรัก สุขภาพ การงาน ภาพรวม",
      description:
        "ดูดวงรายวัน ความรัก สุขภาพ การงาน ภาพรวมประจำวัน อ่านและฟังผ่านหน้าเว็บไซต์ของเราชื่อดังระดับประเทศ",
      startDate: "24 ตุลาคม 2567 เวลา 14.00 น.",
      profileImage: Images.profileSmall,
      astrologer: "หมอดู เพียงฟ้า",
    },
    {
      id: 3,
      image: Images.auctionImages,
      title: "ดูดวงความรัก สุขภาพ การงาน ภาพรวม",
      description:
        "ดูดวงรายวัน ความรัก สุขภาพ การงาน ภาพรวมประจำวัน อ่านและฟังผ่านหน้าเว็บไซต์ของเราชื่อดังระดับประเทศ",
      startDate: "24 ตุลาคม 2567 เวลา 14.00 น.",
      profileImage: Images.profileSmall,
      astrologer: "หมอดู เพียงฟ้า",
    },
  ];

  return (
    <>
       {/* Navbar ตรึงด้านบน */}
       <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 ">
        <Navbar />
      </div>

      {/* เนื้อหาหลักของหน้า */}
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center pt-20 mt-10">
        {/* ส่วนหัวของหน้า */}
        <h1 className="text-4xl font-bold text-[#420F75]">ประมูลดูดวงออนไลน์</h1>
        <p className="text-gray-600 mt-2">เลือกหมวดหมู่ที่คุณสนใจ</p>

        {/* คอมโพเนนต์กล่องค้นหา */}
        <AuctionSearchBar />

        {/* ==================== Section: ประมูลที่กำลังดำเนินอยู่ ==================== */}
        <Pagination
          title="ประมูลที่กำลังดำเนินอยู่"
          subtitle="เลือกประมูลที่คุณต้องการ"
          page={page1}
          setPage={setPage1}
          totalPages={totalPages}
        />
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {auctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>

        {/* ==================== Section: ประมูลที่กำลังมาแรง ==================== */}
        <Pagination
          title="ประมูลที่กำลังมาแรง"
          subtitle="ประมูลยอดนิยมในขณะนี้"
          page={page2}
          setPage={setPage2}
          totalPages={totalPages}
        />
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {auctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>

        {/* ==================== Section: ประมูลที่กำลังจะถึง ==================== */}
        <Pagination
          title="ประมูลที่กำลังจะถึง"
          subtitle="เตรียมตัวให้พร้อมกับประมูลใหม่"
          page={page3}
          setPage={setPage3}
          totalPages={totalPages}
        />
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {auctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Auction;
