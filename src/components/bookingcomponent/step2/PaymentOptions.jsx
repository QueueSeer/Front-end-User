import React from "react";
import Images from "../../../assets";

const PaymentOptions = ({ paymentMethod, onSelect }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">เลือกช่องทางชำระเงิน</h3>

      <div className="flex flex-col space-y-4">
        {/* ✅ ปุ่ม PromptPay */}
        <button
          className={`flex justify-between items-center w-full p-5 border rounded-lg shadow-sm transition 
            ${
              paymentMethod === "promptpay"
                ? "bg-[#65558F] text-white border-[#65558F]"
                : "bg-white text-gray-800 border-gray-300"
            } 
            hover:bg-[#65558F] hover:text-white`}
          onClick={() => onSelect("promptpay")}
        >
          <span className="font-medium">QR Code Promptpay</span>
          <img src={Images.PromptpayMoney} alt="PromptPay" className="w-20" />
        </button>

        {/* ✅ ปุ่ม Coins */}
        <button
          className={`flex justify-between items-center w-full p-5 border rounded-lg shadow-sm transition 
            ${
              paymentMethod === "coins"
                ? "bg-[#65558F] text-white border-[#65558F]"
                : "bg-white text-gray-800 border-gray-300"
            } 
            hover:bg-[#65558F] hover:text-white`}
          onClick={() => onSelect("coins")}
        >
          <span className="font-medium">โชคคอยน์</span>
          <div className="flex items-center space-x-2">
            <img src={Images.CoinMoney} alt="Coins" className="w-20 pl-3" />
            <span className={paymentMethod === "coins" ? "text-white" : "text-[#65558F] font-semibold"}>
              Coins
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PaymentOptions;
