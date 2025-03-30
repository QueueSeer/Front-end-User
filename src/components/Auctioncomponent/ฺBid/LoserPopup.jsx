import React, { useState, useEffect } from "react";
import Images from "../../../assets";
import axios from "axios";

const LoserPopup = ({ rank, onClose, auction_id }) => {
  const [auctionData, setAuctionData] = useState(null);
  const [bidData, setBidData] = useState({
    myBid: null,
    winnerBid: null
  });
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
        
        // ดึงข้อมูลทั้งหมดในคราวเดียว
        const [auctionResponse, bidsResponse] = await Promise.all([
          // ดึงข้อมูลการประมูล
          axios.get(`${API_BASE_URL}/auction/${auction_id}`, {
            headers: {
              'Cache-Control': 'no-cache',
              'Accept': 'application/json'
            },
            withCredentials: true
          }),
          
          // ดึงข้อมูลผู้ประมูลทั้งหมด
          axios.get(`${API_BASE_URL}/auction/${auction_id}/bids/stream?times=1`, {
            headers: {
              'Cache-Control': 'no-cache',
              'Accept': 'application/json'
            },
            withCredentials: true
          })
        ]);
        
        setAuctionData(auctionResponse.data);
        
        // จัดการข้อมูลการประมูล
        let bidsArray = [];
        if (Array.isArray(bidsResponse.data)) {
          bidsArray = bidsResponse.data;
        } else if (bidsResponse.data && typeof bidsResponse.data === 'object') {
          const possibleArrayFields = ['bids', 'items', 'data', 'results'];
          for (const field of possibleArrayFields) {
            if (Array.isArray(bidsResponse.data[field])) {
              bidsArray = bidsResponse.data[field];
              break;
            }
          }
        }
        
        // เรียงลำดับตามจำนวนเงิน (มากไปน้อย)
        const sortedBids = [...bidsArray]
          .filter(bid => bid.amount > 0)
          .sort((a, b) => b.amount - a.amount);
        
        // ค้นหาบิดของผู้ชนะ (อันดับ 1)
        const winnerBid = sortedBids.length > 0 ? sortedBids[0] : null;
        
        // ค้นหาบิดของผู้ใช้ปัจจุบัน
        const myBid = bidsArray.find(bid => bid.is_me === true);
        
        setBidData({
          myBid: myBid ? {
            username: myBid.username || "",
            hiddenUsername: myBid.hidden_username || maskUsername(myBid.username || ""),
            amount: myBid.amount || 0
          } : null,
          
          winnerBid: winnerBid ? {
            username: winnerBid.username || "",
            hiddenUsername: winnerBid.hidden_username || maskUsername(winnerBid.username || ""),
            amount: winnerBid.amount || 0
          } : null
        });
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auction_id]);

  // ฟังก์ชันปกปิดชื่อผู้ใช้
  const maskUsername = (username) => {
    if (!username || username.length < 3) return "***";
    return username.substring(0, 2) + "*".repeat(username.length - 2);
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
        <h2 className="text-xl font-bold text-purple-800">ลำดับผลการประมูล</h2>
        <p className="text-gray-600 text-sm mt-1">
          {auctionData?.name || "ดูดวงความรัก สุขภาพ การงาน ภาพรวมประจำปี"}
        </p>

        {/* ไอคอนมงกุฎ + รูปโปรไฟล์ */}
        <div className="relative mt-4">
          {/*  มงกุฎ + เลขอันดับ */}
          <div className="relative w-12 mx-auto">
            <img src={Images.CrownOne} alt="Crown" className="w-12 mx-auto" />
            <span className="absolute top-[2px] left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {rank || "?"}
            </span>
          </div>

          <img 
            src={Images.profilemam} 
            alt="Profile" 
            className="w-24 h-24 rounded-full mx-auto border-3 border-purple-300 pt-1"
          />
        </div>

        {/*  ข้อมูลลำดับการประมูล */}
        <div className="bg-pink-500 text-white px-3 py-1 rounded-lg mt-3 w-[200px] mx-auto">
          <p className="text-xs font-bold">
            {bidData.myBid?.hiddenUsername || "Su*******"}
          </p>
          <p className="text-md font-semibold">
            {bidData.myBid?.hiddenUsername || "Km*****"}
          </p>
          <p className="text-sm font-bold">{bidData.myBid?.amount || 0} Coins</p>
        </div>

        {/* ข้อมูลผู้ชนะการประมูล */}
        <div className="mt-5">
          <p className="text-sm font-semibold text-gray-700">ผู้ชนะการประมูล</p>
          <div className="bg-green-100 text-gray-800 px-3 py-1 rounded-lg mt-1 w-[200px] mx-auto">
            <p className="text-xs font-bold">
              {bidData.winnerBid?.hiddenUsername || "Su*******"}
            </p>
            <p className="text-md font-semibold">
              {bidData.winnerBid?.hiddenUsername || "Km*****"}
            </p>
            <p className="text-sm font-bold">{bidData.winnerBid?.amount || 85} Coins</p>
          </div>
        </div>

        {/* ปุ่มปิด */}
        <button
          className="mt-6 bg-purple-800 text-white font-medium px-8 py-1 rounded-full"
          onClick={onClose}
        >
          ปิดหน้าต่าง
        </button>
      </div>
    </div>
  );
};

export default LoserPopup;