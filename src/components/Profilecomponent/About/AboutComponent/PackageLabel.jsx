import React from "react";

const PackageLabel = ({ type }) => {
  const labelStyles = {
    promotion: { text: "โปรโมชัน", bgColor: "bg-purple-500" },
    new: { text: "มาใหม่", bgColor: "bg-red-500" },
    discount: { text: "-45%", bgColor: "bg-red-600" },
  };

  if (!labelStyles[type]) return null;

  return (
    <span
      className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded-full ${labelStyles[type].bgColor}`}
    >
      {labelStyles[type].text}
    </span>
  );
};

export default PackageLabel;
