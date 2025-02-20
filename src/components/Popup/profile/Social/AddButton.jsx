import React from "react";

const AddButton = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 text-gray-800 hover:text-purple-600"
    >
      <img src={icon} alt={label} className="w-9 h-9 rounded-lg" />
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default AddButton;
