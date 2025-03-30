import React, { useState, useEffect } from "react";
import Images from "../../../assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WinnerPopup = ({ onClose, auction_id }) => {
  const navigate = useNavigate();
  const [auctionData, setAuctionData] = useState(null);
  const [userBidInfo, setUserBidInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL
  const API_BASE_URL = 'https://backend.qseer.app/api';

  useEffect(() => {
    const fetchData = async () => {
      if (!auction_id) {
        setError("ไม่พบข้อมูลการประมูล");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // ดึงข้อมูลการประมูลและข้อมูลบิดของผู้ใช้ในคราวเดียว
        const [auctionResponse, myBidResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/auction/${auction_id}`, {
            headers: {
              'Cache-Control': 'no-cache',
              'Accept': 'application/json'
            },
            withCredentials: true
          }),
          
          axios.get(`${API_BASE_URL}/auction/${auction_id}/bids/me`, {
            headers: {
              'Cache-Control': 'no-cache',
              'Accept': 'application/json'
            },
            withCredentials: true
          })
        ]);
        
        setAuctionData(auctionResponse.data);
        setUserBidInfo(myBidResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auction_id]);

  // ฟังก์ชันนำทางไปยังหน้ารายละเอียดการประมูล
  const goToAuctionDetails = () => {
    navigate(`/auction-details/${auction_id}`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl p-6 w-[450px] shadow-lg flex justify-center items-center">
          <div className="animate-spin h-10 w-10 border-4 border-purple-500 rounded-full border-t-transparent"></div>
          <p className="ml-3 text-purple-800">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl p-6 w-[450px] shadow-lg text-center relative">
          <h2 className="text-xl font-bold text-red-600">เกิดข้อผิดพลาด</h2>
          <p className="mt-4 text-gray-700">{error}</p>
          <button
            className="mt-6 bg-purple-800 text-white font-medium px-8 py-1 rounded-full"
            onClick={onClose}
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 w-[450px] shadow-lg text-center relative">
        {/* หัวข้อ */}
        <h2 className="text-xl font-bold text-purple-800">ยินดีด้วย! คุณชนะการประมูล</h2>

        {/* ไอคอนมงกุฎ + รูปโปรไฟล์ */}
        <div className="relative mt-4">
          {/* มงกุฎ + เลข 1 ซ้อนกัน */}
          <div className="relative w-12 mx-auto">
            <img src={Images.CrownOne} alt="Crown" className="w-12 mx-auto" />
            <span className="absolute top-[2px] left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              1
            </span>
          </div>

          <img 
            src={userBidInfo?.user_image || Images.profilemam} 
            alt="Profile" 
            className="w-24 h-24 rounded-full mx-auto border-4 border-purple-300 mb-2 pt-2"
            onError={(e) => {
              e.target.src = Images.profilemam;
            }} 
          />
        </div>

        {/* ปรับขนาดกรอบข้อมูลผู้ชนะให้เล็กลง */}
        <div className="bg-pink-500 text-white px-3 py-1 rounded-lg w-[180px] mx-auto mt-5">
          <p className="text-xs font-bold">{userBidInfo?.user_display_name || "ผู้ใช้งาน"}</p>
          <p className="text-md font-semibold">{userBidInfo?.username || "User"}</p>
          <p className="text-xs">{userBidInfo?.amount || 0} Coins</p>
        </div>

        {/* รายละเอียดการประมูล */}
        <p className="text-lg font-semibold text-gray-800 mt-4">
          {auctionData?.name || "ดูดวงความรัก สุขภาพ การงาน ภาพรวมประจำปี"}
        </p>
        <p className="text-sm text-gray-600">
          {auctionData?.seer?.display_name || "หมอดู เพียงฟ้า พาขวัญ"}
        </p>

        {/* ลิงก์รายละเอียดเพิ่มเติม */}
        <button
          className="mt-4 text-purple-700 font-medium underline"
          onClick={goToAuctionDetails}
        >
          สามารถดูรายละเอียดเพิ่มเติม
        </button>

        {/* ปุ่มปิด */}
        <button
          className="absolute top-2 right-2 text-gray-500 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default WinnerPopup;