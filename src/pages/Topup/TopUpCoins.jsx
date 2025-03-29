import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LuckCard from "../../components/TopupComponent/LuckCard";
import TopUpPackageCard from "../../components/TopupComponent/TopUpPackageCard";
import PaymentOptionCard from "../../components/TopupComponent/PaymentOptionCard";
import Images from "../../assets";
import Navbar from "../../components/navbar/index";

const API_BASE_URL = 'https://backend.qseer.app';

const TopUpCoins = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || null;

  const [currentCoins, setCurrentCoins] = useState(0); // ค่าเริ่มต้น 198 coins ตามโค้ดเดิม
  const [selectedCoins, setSelectedCoins] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');

  // ดึงข้อมูลผู้ใช้เมื่อโหลดหน้า
  // ดึงข้อมูลผู้ใช้เมื่อโหลดหน้า
useEffect(() => {
  const fetchUserInfo = async () => {
    setIsLoading(true);
    try {
      // เรียก API เพื่อดึงข้อมูลผู้ใช้
      const response = await fetch(`${API_BASE_URL}/api/user/me`, {
        method: 'GET',
        credentials: 'include' // ส่ง cookies ไปด้วย
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentCoins(data.coins || 0); // ใช้ค่า coins จาก API
        setUserName(data.display_name || data.username || 'ผู้ใช้');
        setError(null);
      } else if (response.status === 401 || response.status === 403) {
        console.warn("ผู้ใช้ยังไม่ได้ล็อกอิน");
        setCurrentCoins(198); // ถ้าไม่ได้ล็อกอิน ใช้ค่าเริ่มต้น 198
      } else {
        console.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้:", response.status);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง");
        setCurrentCoins(198); // ถ้าเกิดข้อผิดพลาด ใช้ค่าเริ่มต้น 198
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
      setCurrentCoins(198); // ถ้าเกิดข้อผิดพลาด ใช้ค่าเริ่มต้น 198
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchUserInfo();
}, []);

  // เมื่อกลับจากหน้า Summary จะอัปเดต Coins ถ้ามีข้อมูลส่งกลับมา
  useEffect(() => {
    if (location.state && location.state.updatedCoins) {
      setCurrentCoins(location.state.updatedCoins);
    }
  }, [location.state]);

  const handleSelectPackage = (coins, price) => {
    setSelectedCoins(coins);
    setSelectedPrice(price);
  };

  // เพิ่ม Effect เพื่อเลื่อนไปที่ต้นหน้าเสมอเมื่อโหลดหน้านี้
useEffect(() => {
  window.scrollTo(0, 0);
}, []);

// แก้ไขฟังก์ชัน handleProceed ให้แสดงสถานะโหลด 3 วินาที
const handleProceed = () => {
  if (selectedCoins && selectedPayment) {
    // เริ่มแสดงสถานะโหลด
    setIsLoading(true);
    
    // รอ 3 วินาทีแล้วค่อยนำทางไปหน้า summary
    setTimeout(() => {
      navigate("/summary", {
        state: { 
          selectedCoins, 
          selectedPrice, 
          selectedPayment, 
          currentCoins,
          userName,
          from 
        }
      });
      // จะยังคงแสดงสถานะโหลดต่อไป จนกระทั่งหน้าถัดไปโหลดเสร็จ
      // เพราะเป็นการ navigate ไปหน้าอื่น จึงไม่จำเป็นต้อง setIsLoading(false)
    }, 3000); // 3 วินาที
  }
};

  return (
    <>
      {/* Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>

      {/* เนื้อหาหลัก */}
      <div className="flex justify-center min-h-screen bg-gray-100 py-10 pt-16">
        <div className="w-full max-w-5xl bg-white p-10 rounded-lg shadow-lg border border-gray-300 relative">
          <h1 className="text-3xl font-bold text-[#5A189A] text-center">เติมโชค</h1>
          <p className="text-gray-600 text-center mt-2">เติมโชควันนี้ เลือกประสบการณ์ใหม่ที่ใช่สำหรับคุณ</p>

          {/* แสดงข้อความแจ้งเตือนถ้ามี error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded my-4">
              {error}
            </div>
          )}

          <div className="border-t border-gray-300 my-6"></div>

          {/* Content Grid */}
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-5 flex items-start">
              <div className="sticky top-20 self-start">
                <LuckCard coins={currentCoins} isLoading={isLoading} />
              </div>
            </div>

            <div className="col-span-7 space-y-6 ml-auto">
              {/* 1. แพ็กเกจเติมโชค */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-[#5A189A] text-white rounded-full">1</div>
                  <h2 className="text-lg font-semibold">แพ็กเกจเติมโชค</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  โชคใน Qseer ช่วยคุณสามารถใช้สำหรับซื้อแพ็กเกจต่าง ๆ บน Qseer หรือการแลกเปลี่ยนหมอดูที่คุณต้องการ
                </p>
                <div className="grid grid-cols-3 gap-5">
                  <TopUpPackageCard icon={Images.clover} coins={29} price={29} isSelected={selectedCoins === 29} onSelect={handleSelectPackage} />
                  <TopUpPackageCard icon={Images.lotus} coins={49} price={49} isSelected={selectedCoins === 49} onSelect={handleSelectPackage} />
                  <TopUpPackageCard icon={Images.Redbag} coins={100} price={100} isSelected={selectedCoins === 100} onSelect={handleSelectPackage} />
                  <TopUpPackageCard icon={Images.RedEnvelope} coins={200} price={200} isSelected={selectedCoins === 200} onSelect={handleSelectPackage} />
                  <TopUpPackageCard icon={Images.slot} coins={300} price={300} isSelected={selectedCoins === 300} onSelect={handleSelectPackage} />
                </div>
              </div>

              <div className="border-t border-gray-300"></div>

              {/* 2. ช่องทางการชำระเงิน */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-[#5A189A] text-white rounded-full">2</div>
                  <h2 className="text-lg font-semibold">เลือกช่องทางการชำระเงิน</h2>
                </div>
                <PaymentOptionCard isSelected={selectedPayment === "QR"} onSelect={() => setSelectedPayment("QR")} />
              </div>

              <div className="border-t border-gray-300"></div>

              {/* ราคาสินค้า */}
              <div>
                <p className="text-2xl font-bold flex justify-between">
                  ราคาสินค้า
                  <span className="font-bold text-[#5A189A]">{selectedPrice.toFixed(2)} THB</span>
                </p>
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 mt-3">
                  <p className="text-sm text-gray-500">
                    กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนทำรายการ คุณจะไม่สามารถขอคืนเงิน ยกเลิก หรือแก้ไขรายการได้
                  </p>
                </div>
              </div>

              {/* ปุ่มยืนยันการซื้อ */}
              <button
                className={`mt-6 w-full px-6 py-3 text-white rounded-lg ${
                  selectedCoins && selectedPayment && !isLoading ? "bg-[#5A189A]" : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!selectedCoins || !selectedPayment || isLoading}
                onClick={handleProceed}
              >
                ซื้อเลย
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopUpCoins;