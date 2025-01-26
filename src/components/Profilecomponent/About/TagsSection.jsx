import React from "react";

const TagsSection = () => {
  const tags = ["ความรัก", "การงาน", "การเงิน", "สุขภาพ", "ภาพรวม"];

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold text-[#615E83]">แท็ก</h2>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <span key={index} className="px-4 py-2 border border-gray-400 rounded-full text-gray-700">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagsSection;
