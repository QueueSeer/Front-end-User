import React, { useState } from "react";
import PopupBank from "../../../components/Popup/profile/PopupBank";
import Images from "../../../assets";

const AccountPrompay = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div>
      <h2 className="text-xl text-gray-800 font-semibold mb-4">
        ข้อมูลบัญชีพร้อมเพย์
      </h2>
      <button
        onClick={() => setIsPopupOpen(true)}
        className="border-2 h-[90px] px-[30px] py-[20px] rounded-[5px] w-[420px]"
      >
        <div className="flex flex-row gap-[20px] items-center">
          <img
            src={Images.WalletIcon}
            alt="Link Icon"
            className="mr-3 w-8 h-8 items-center"
          />
          <div className="flex flex-col gap-[5px] items-start">
            <div className="font-semibold text-black text-[18px]">
              บัญชีพร้อมเพย์
            </div>
          </div>
        </div>
      </button>

      {/* Popup Component */}
      <PopupBank
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
};

export default AccountPrompay;
