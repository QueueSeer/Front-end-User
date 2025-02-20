import React from "react";

const SocialLinkItem = ({ name, url, icon, onUpdate, onEdit }) => {
  const handleUpdateLink = () => {
    // Pass the data to the onEdit handler to open the form with pre-filled data
    onEdit(name, url);
  };

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={icon} alt={name} className="w-9 h-9 rounded-lg" />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{name}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600"
          >
            {url}
          </a>
        </div>
      </div>
      <button
        onClick={handleUpdateLink}
        className="text-purple-600 border border-purple-600 px-4 py-1 rounded-lg text-sm hover:bg-purple-100"
      >
        อัปเดตลิงก์
      </button>
    </li>
  );
};

export default SocialLinkItem;
