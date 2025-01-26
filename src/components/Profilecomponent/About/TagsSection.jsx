import React, { useState } from "react";
import PackageSection from "./AboutComponent/PackageSection"; 

const TagsSection = () => {
  const tags = ["ความรัก", "การงาน", "การเงิน", "สุขภาพ", "ภาพรวม"];
  const [selectedTag, setSelectedTag] = useState(""); // สร้าง state สำหรับแท็กที่เลือก

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold flex items-center">
        <span className="w-2 h-6 bg-[#8677A7] rounded-full mr-2"></span>แท็ก
      </h2>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <button
            key={index}
            className={`px-4 py-2 border border-gray-400 rounded-full text-[#420F75] ${
              selectedTag === tag ? "bg-[#8677A7] text-white" : ""
            }`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* ส่งค่า selectedTag ไปยัง PackageSection */}
      <PackageSection selectedTag={selectedTag} />
    </div>
  );
};

export default TagsSection;
