import React from "react";

const ButtonComponent = ({ label, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`mt-4 px-6 py-2 rounded-full ${className}`}
    >
      {label}
    </button>
  );
};

export default ButtonComponent;
