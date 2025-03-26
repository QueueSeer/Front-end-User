import React, { useState } from "react";

// รายการหัวข้อทั้งหมด
const starOptions = [5, 4, 3, 2, 1];
const interestOptions = [
  "ความรัก",
  "การเรียน",
  "การงาน",
  "ค้นหาตัวตน",
  "สุขภาพ",
  "ทั่วไป",
  "การเงิน",
  "ดวงรายเดือน",
  "ดวงรายปี",
];
const packageOptions = [
  "1 คำถาม",
  "2 คำถาม",
  "3 คำถาม",
  "ไม่จำกัดคำถาม",
  "โทรคุยไม่เห็นหน้า",
  "โทรคุยเห็นหน้า",
  "Voice Audio",
  "ราศีเดียว",
  "ราศี",
  "ภาพรวม",
];

const SidebarFilter = () => {
  // State แต่ละหมวด
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);

  // ฟังก์ชันกดรีเซ็ต
  const resetAll = () => {
    setSelectedStars([]);
    setSelectedInterests([]);
    setSelectedPackages([]);
  };

  // Toggle ฟิลเตอร์แต่ละตัว
  const toggleItem = (value, selectedList, setSelectedList) => {
    if (selectedList.includes(value)) {
      setSelectedList(selectedList.filter((item) => item !== value));
    } else {
      setSelectedList([...selectedList, value]);
    }
  };

  // Select All
  const handleSelectAll = (type) => {
    switch (type) {
      case "stars":
        setSelectedStars([...starOptions]);
        break;
      case "interests":
        setSelectedInterests([...interestOptions]);
        break;
      case "packages":
        setSelectedPackages([...packageOptions]);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full text-sm text-[#2D2D2D]">
      {/* ตัวกรองศาสตร์หมอดู */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold">ตัวกรองศาสตร์หมอดู</p>
          <button onClick={resetAll} className="text-[#6C2DBE] text-xs underline">
            รีเซ็ต
          </button>
        </div>

        {/* ศาสตร์หมอดู */}
        <div className="mb-4">
          <label className="block text-sm mb-1">ศาสตร์หมอดู</label>
          <select className="w-full p-2 border border-gray-300 rounded">
            <option>เลือกศาสตร์หมอดู</option>
            <option>ไพ่ทาโรต์</option>
            <option>โหราศาสตร์ไทย</option>
          </select>
        </div>

        {/* ระดับดาว */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold">ระดับดาว</p>
            <button
              className="text-xs underline text-[#2D2D2D]"
              onClick={() => handleSelectAll("stars")}
            >
              ทั้งหมด
            </button>
          </div>
          {starOptions.map((star) => (
            <div key={star} className="flex items-center mt-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedStars.includes(star)}
                onChange={() => toggleItem(star, selectedStars, setSelectedStars)}
              />
              <label>{Array(star).fill("⭐").join("")}</label>
            </div>
          ))}
        </div>

        {/* เรื่องที่สนใจ */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold">เรื่องที่สนใจ</p>
            <button
              className="text-xs underline text-[#2D2D2D]"
              onClick={() => handleSelectAll("interests")}
            >
              ทั้งหมด
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {interestOptions.map((item) => (
              <label key={item} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedInterests.includes(item)}
                  onChange={() => toggleItem(item, selectedInterests, setSelectedInterests)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* แพ็กเกจที่สนใจ */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold">แพ็กเกจที่สนใจ</p>
            <button
              className="text-xs underline text-[#2D2D2D]"
              onClick={() => handleSelectAll("packages")}
            >
              ทั้งหมด
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {packageOptions.map((item) => (
              <label key={item} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedPackages.includes(item)}
                  onChange={() => toggleItem(item, selectedPackages, setSelectedPackages)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* ช่วงราคา */}
        <div className="mb-4">
          <p className="font-semibold mb-2">ช่วงราคา</p>
          <div className="space-y-2 mb-4">
            {["ต่ำกว่า 100 บาท", "ต่ำกว่า 500 บาท", "ต่ำกว่า 1,000 บาท"].map((price, idx) => (
              <label key={idx} className="flex items-center">
                <input type="radio" name="priceRange" className="mr-2" />
                {price}
              </label>
            ))}
          </div>

          <input type="range" min={0} max={1000} step={50} className="w-full accent-[#6C2DBE]" />
          <div className="flex justify-between items-center mt-2 text-xs text-gray-700">
            <input
              type="number"
              placeholder="ราคาขั้นต่ำ"
              className="w-[48%] p-1 border rounded"
            />
            <input
              type="number"
              placeholder="ราคาสูงสุด"
              className="w-[48%] p-1 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilter;
