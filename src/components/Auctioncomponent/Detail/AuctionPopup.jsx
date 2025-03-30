import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../../assets"; 

const AuctionPopup = ({ auction, onClose, userCoins: propUserCoins, hasJoinedAuction }) => {
  const navigate = useNavigate();
  const [userCoins, setUserCoins] = useState(propUserCoins || 0);
  const [isLoading, setIsLoading] = useState(!propUserCoins);
  const [auctionStatus, setAuctionStatus] = useState("loading"); // "not_started", "active", "ended"

  // ตรวจสอบสถานะของประมูล
  useEffect(() => {
    if (!auction) return;

    const checkAuctionStatus = () => {
      const now = new Date().getTime();
      const startTime = new Date(auction.originalData?.start_time || auction.startDate).getTime();
      const endTime = new Date(auction.originalData?.end_time || auction.endDate).getTime();

      if (now < startTime) {
        setAuctionStatus("not_started");
      } else if (now > endTime) {
        setAuctionStatus("ended");
      } else {
        setAuctionStatus("active");
      }
    };

    checkAuctionStatus();
    // ตั้งเวลาตรวจสอบสถานะทุก 10 วินาที
    const interval = setInterval(checkAuctionStatus, 10000);

    return () => clearInterval(interval);
  }, [auction]);

  // ดึงข้อมูลจำนวน coins ของผู้ใช้จาก API (ถ้าไม่ได้รับจาก props)
  useEffect(() => {
    // ถ้ามี userCoins จาก props แล้ว ไม่ต้องดึงจาก API อีก
    if (propUserCoins !== undefined) {
      setUserCoins(propUserCoins);
      setIsLoading(false);
      return;
    }

    const fetchUserCoins = async () => {
      setIsLoading(true);
      try {
        // เรียก API เพื่อดึงข้อมูลผู้ใช้ที่มี coins รวมอยู่ด้วย
        const API_BASE_URL = 'https://backend.qseer.app';
        const response = await fetch(`${API_BASE_URL}/api/user/me`, {
          method: 'GET',
          credentials: 'include' // สำคัญ! ส่ง cookies ไปด้วย
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUserCoins(userData.coins || 0);
        } else {
          // ถ้าไม่สามารถดึงข้อมูลได้ (ยังไม่ล็อกอิน ฯลฯ) กำหนดให้ coins เป็น 0
          console.warn("ไม่สามารถดึงข้อมูลผู้ใช้:", response.status);
          setUserCoins(0);
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
        setUserCoins(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserCoins();
  }, [propUserCoins]);

  // ตรวจสอบว่ามี coins พอหรือไม่ หรือเคยเข้าร่วมประมูลแล้ว
  const hasEnoughCoins = hasJoinedAuction || userCoins >= (auction?.initialBid || 50);
  
  // ตรวจสอบว่าสามารถเข้าร่วมประมูลได้หรือไม่
  const canJoinAuction = (auctionStatus === "active" && hasEnoughCoins && !isLoading) || hasJoinedAuction;

  // กำหนดขั้นตอนการประมูล โดยใช้ข้อมูลจาก auction ที่ได้รับ
  const steps = [
    { 
      id: "01", 
      title: `เริ่มต้น ${auction?.initialBid || 50} coins`, 
      desc: hasJoinedAuction 
        ? `คุณเคยเข้าร่วมประมูลนี้แล้ว สามารถเข้าหน้าประมูลได้ทันที`
        : `จะเข้าร่วมการประมูลได้ ต้องมีโชค Coins เริ่มต้นที่ ${auction?.initialBid || 50} coins กรณีที่มีโชค Coins ไม่ถึง เติมได้ที่ โชคCoins` 
    },
    { 
      id: "02", 
      title: "อ่านรายละเอียด", 
      desc: "โปรดตรวจสอบรายละเอียดแพ็กเกจอย่างละเอียดก่อนเข้าร่วม เพื่อให้มั่นใจว่าตรงตามความต้องการของคุณ" 
    },
    { 
      id: "03", 
      title: "เข้าร่วมการประมูล", 
      desc: hasJoinedAuction 
        ? "คุณสามารถเข้าร่วมประมูลต่อได้ทันทีโดยไม่ต้องวางเงินเพิ่ม" 
        : "เมื่อพร้อมแล้วคุณสามารถเข้าร่วมการประมูลและวางเงิน ประมูลตามขั้นตอนที่ระบบกำหนด" 
    },
    { 
      id: "04", 
      title: "สรุปผลการประมูล", 
      desc: "หลังจากการประมูลสิ้นสุด ระบบจะแจ้งผลผู้ชนะให้ได้รับแพ็กเกจทันที" 
    }
  ];

  // ฟังก์ชันจัดการเมื่อกดยอมรับเงื่อนไข
  const handleAcceptConditions = () => {
    if (!canJoinAuction && !hasJoinedAuction) return;
    
    // นำทางไปยังหน้า bidAuction พร้อมส่งข้อมูลประมูล
    navigate(`/bidAuction/${auction?.id}`, {
      state: { 
        auction_id: auction.id,
        initialBid: auction.initialBid,
        minIncrement: auction.minIncrement,
        auctioneerName: auction.astrologer.name
      } 
    });
  };

  // ฟังก์ชันนำทางไปหน้าเติมเงิน
  const handleTopUpCoins = () => {
    if (auctionStatus === "active" && !hasEnoughCoins && !hasJoinedAuction) {
      // นำทางไปยังหน้าเติมเงินพร้อมข้อมูลว่ามาจากหน้าประมูล
      navigate(`/top-up-coins`, { 
        state: { from: "BidAuctionFooter" } 
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-[600px] max-h-[600px] overflow-y-auto relative">
        {/* ปิด Popup */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500">
          ✖
        </button>

        {/* หัวข้อ */}
        <h2 className="text-lg font-bold text-[#5A189A] flex items-center">
          <img src={Images.Sledgehammer} alt="ประมูล" className="w-6 h-6 mr-2" />
          รายละเอียดการประมูล
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          การประมูลดูดวง คือระบบที่เปิดให้ลูกค้าสามารถเข้าร่วมประมูลเพื่อจองคิวปรึกษาหมอดู
          โดยมีขั้นตอนการประมูลดังนี้
        </p>

        {/* แสดงสถานะถ้าเคยเข้าร่วมประมูลแล้ว */}
        {hasJoinedAuction && (
          <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mt-4 text-sm">
            คุณเคยเข้าร่วมประมูลแล้ว สามารถเข้าสู่หน้าประมูลได้ทันที
          </div>
        )}

        {/* โชคของคุณ */}
        <div className="bg-[#8677A7] text-white p-5 rounded-lg mt-4 text-center">
          <p className="text-lg">โชคของคุณ</p>
          {isLoading ? (
            <div className="flex justify-center my-2">
              <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <p className="text-3xl font-bold">{userCoins} Coins</p>
          )}
        </div>

        {/* ขั้นตอนการประมูล */}
        <div className="flex mt-6">
          {/* เส้นเชื่อม + วงกลมหมายเลข */}
          <div className="relative flex flex-col items-center w-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#5A189A] text-white flex items-center justify-center rounded-full text-lg font-bold">
                  {step.id}
                </div>
                {index < steps.length - 1 && <div className="w-1 h-12 bg-gray-300"></div>}
              </div>
            ))}
          </div>

          {/* เนื้อหาขั้นตอน */}
          <div className="flex flex-col gap-8 ml-5">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div>
                  <h3 className="text-[#5A189A] font-bold">{step.title}</h3>
                  <p className="text-gray-700 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ข้อความแจ้งเตือน */}
        {!isLoading && !hasJoinedAuction && (
          <>
            {auctionStatus === "not_started" && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mt-4 text-sm">
                การประมูลนี้ยังไม่เริ่ม โปรดรอจนกว่าจะถึงเวลาเริ่มประมูล ({auction.startDate})
              </div>
            )}
            
            {auctionStatus === "ended" && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4 text-sm">
                การประมูลนี้สิ้นสุดแล้ว
              </div>
            )}
            
            {auctionStatus === "active" && !hasEnoughCoins && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4 text-sm flex justify-between items-center">
                <span>คุณมี Coins ไม่เพียงพอสำหรับการประมูลนี้</span>
                <button 
                  onClick={handleTopUpCoins}
                  className="bg-red-100 hover:bg-red-200 text-red-700 py-1 px-3 rounded-full text-xs transition"
                >
                  เติม Coins
                </button>
              </div>
            )}
          </>
        )}

        {/* ปุ่มยืนยัน */}
        <div className="flex justify-between mt-6 gap-4">
          {/* เมื่อกดปุ่ม "ยอมรับเงื่อนไข" ไปหน้า BidAuction */}
          <button
            className={`${
              canJoinAuction
                ? hasJoinedAuction ? "bg-green-600 hover:bg-green-700" : "bg-[#8677A7] hover:bg-[#77599A]"
                : "bg-gray-400 cursor-not-allowed"
            } text-white py-3 px-6 rounded-full w-1/2 text-base font-medium transition`}
            onClick={handleAcceptConditions}
            disabled={!canJoinAuction}
          >
            {hasJoinedAuction ? "ไปหน้าประมูล" : "ยอมรับเงื่อนไข"}
          </button>

          {/* เมื่อกดปุ่ม "ย้อนดูรายละเอียด" กลับไปหน้า Auction */}
          <button
            className="bg-gray-300 text-gray-700 py-3 px-6 rounded-full w-1/2 text-base font-medium"
            onClick={onClose}
          >
            ย้อนดูรายละเอียด
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionPopup;