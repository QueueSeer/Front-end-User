import React, { useState } from "react";
import Images from "../../../assets";
import PopupCategory from "../../../components/Popup/profile/PopupCategory";
import PopupInterest from "../../../components/Popup/profile/PopupInterest";

const CategoryUser = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isInterestPopupOpen, setIsInterestPopupOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState("");

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);
  const toggleInterestPopup = () => setIsInterestPopupOpen(!isInterestPopupOpen);

  const handleSaveCategory = (category) => {
    setSelectedCategory(category);
    setIsPopupOpen(false);
  };

  const handleSaveInterest = (interest) => {
    setSelectedInterest(interest);
    setIsInterestPopupOpen(false);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl text-gray-800 font-semibold mb-4">เรื่องที่สนใจของฉัน</h2>

      <div className="flex gap-5">
        {/* หมวดหมู่ดูดวง */}
        <button onClick={togglePopup} className="border-2 px-6 py-4 rounded-md w-full flex items-center gap-4">
          <img src={Images.StarsIcon} alt="Icon" className="w-8 h-8" />
          <div>
            <div className="font-semibold text-black">หมวดหมู่ดูดวง</div>
            <div className="text-gray-600">{selectedCategory || "ยังไม่มีหมวดหมู่ที่เลือก"}</div>
          </div>
        </button>

        {/* เรื่องที่สนใจ */}
        <button onClick={toggleInterestPopup} className="border-2 px-6 py-4 rounded-md w-full flex items-center gap-4">
          <img src={Images.HeartIcon} alt="Icon" className="w-8 h-8" />
          <div>
            <div className="font-semibold text-black">เรื่องที่สนใจ</div>
            <div className="text-gray-600">{selectedInterest || "ยังไม่มีเรื่องที่สนใจ"}</div>
          </div>
        </button>
      </div>

      <PopupCategory isOpen={isPopupOpen} onClose={togglePopup} onSave={handleSaveCategory} />
      <PopupInterest isOpen={isInterestPopupOpen} onClose={toggleInterestPopup} onSave={handleSaveInterest} />
    </div>
  );
};

export default CategoryUser;
