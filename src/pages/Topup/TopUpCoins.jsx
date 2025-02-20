import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LuckCard from "../../components/TopupComponent/LuckCard";
import TopUpPackageCard from "../../components/TopupComponent/TopUpPackageCard";
import PaymentOptionCard from "../../components/TopupComponent/PaymentOptionCard";
import Images from "../../assets";

const TopUpCoins = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || null; // ✅ รับค่าจาก BidAuctionFooter ถ้ามี

  // ตั้งค่า Coins เริ่มต้น
  const [currentCoins, setCurrentCoins] = useState(198);
  const [selectedCoins, setSelectedCoins] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // เมื่อกลับจากหน้า Summary จะอัปเดต Coins
  useEffect(() => {
    if (location.state && location.state.updatedCoins) {
      setCurrentCoins(location.state.updatedCoins);
    }
  }, [location.state]);

  const handleSelectPackage = (coins, price) => {
    setSelectedCoins(coins);
    setSelectedPrice(price);
  };

  const handleProceed = () => {
    if (selectedCoins && selectedPayment) {
      navigate("/summary", {
        state: { selectedCoins, selectedPrice, selectedPayment, currentCoins, from }, // ✅ ส่ง `from` ไป SummaryPage
      });
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 py-10">
      <div className="w-full max-w-5xl bg-white p-10 rounded-lg shadow-lg border border-gray-300 relative">
        <h1 className="text-3xl font-bold text-[#5A189A] text-center">เติมโชค</h1>
        <p className="text-gray-600 text-center mt-2">เติมโชควันนี้ เลือกประสบการณ์ใหม่ที่ใช่สำหรับคุณ</p>

        <div className="border-t border-gray-300 my-6"></div>

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-5 flex items-start">
            <div className="sticky top-20 self-start">
              <LuckCard coins={currentCoins} />
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
                selectedCoins && selectedPayment ? "bg-[#5A189A]" : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!selectedCoins || !selectedPayment}
              onClick={handleProceed}
            >
              ซื้อเลย
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpCoins;
