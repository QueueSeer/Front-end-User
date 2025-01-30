import React from "react";
import Images from "../../../assets";

const PaymentOptions = ({ paymentMethod, onSelect }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mt-8">เลือกช่องทางชำระเงิน</h3>
      <div className="flex space-x-4 mt-2">
        <button
          className={`p-3 flex items-center border rounded-md ${
            paymentMethod === "promptpay" ? "bg-gray-200" : ""
          }`}
          onClick={() => onSelect("promptpay")}
        >
          <img src={Images.PromptpayMoney} alt="PromptPay" className="w-6 h-6 mr-2" />
          QR Code PromptPay
        </button>
        <button
          className={`p-3 flex items-center border rounded-md ${
            paymentMethod === "coins" ? "bg-gray-200" : ""
          }`}
          onClick={() => onSelect("coins")}
        >
          <img src={Images.CoinMoney} alt="Coins" className="w-6 h-6 mr-2" />
          Coins
        </button>
      </div>
    </div>
  );
};

export default PaymentOptions;
