import React, { useState } from "react";
import Images from "../../../assets";
import SocialLinkItem from "./Social/SocialLinkItem";
import AddSocialLinkButton from "./Social/AddButton";
import SocialLinkFormPopup from "./Social/SocialLinkFormPopup";
import CloseButton from "../../Button/CloseButton";

const PopupSocialLinks = ({ isOpen, onClose }) => {
  const [socialLinks, setSocialLinks] = useState([
    {
      name: "Facebook",
      url: "https://www.facebook.com/",
      icon: Images.FacebookIcon,
    },
    { name: "LINE", url: "https://line.me/", icon: Images.LineIcon },
    {
      name: "YouTube",
      url: "https://www.youtube.com/",
      icon: Images.YoutubeIcon,
    },
  ]);

  const [showFormPopup, setShowFormPopup] = useState(false);
  const [currentLinkData, setCurrentLinkData] = useState({ name: "", url: "" });
  const [popupTitle, setPopupTitle] = useState(""); // เพิ่มสถานะเพื่อเก็บชื่อของ Popup

  const addLink = (newLink) => {
    setSocialLinks((prevLinks) => [...prevLinks, newLink]);
  };

  const handleEditLink = (name, url) => {
    // Set the form data with the selected link's details
    setCurrentLinkData({ name, url });
    setPopupTitle(`อัปเดตลิงก์ ${name}`); // เปลี่ยนชื่อ Popup ตามช่องทางที่เลือก
    setShowFormPopup(true); // เปิดฟอร์มเพื่อแก้ไขช่องทางที่เลือก
  };

  const handleAddNewLink = () => {
    // Reset the form data when adding a new link
    setCurrentLinkData({ name: "", url: "" });
    setPopupTitle("เพิ่มลิงก์ใหม่"); // ตั้งชื่อ Popup เป็น "เพิ่มลิงก์ใหม่"
    setShowFormPopup(true); // เปิดฟอร์มเพื่อเพิ่มลิงก์ใหม่
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white px-[50px] py-[30px] rounded-lg w-[550px] shadow-lg">
        {showFormPopup ? (
          // Show the form popup with current data or empty for new link
          <SocialLinkFormPopup
            isOpen={showFormPopup}
            onClose={() => setShowFormPopup(false)}
            onSave={(newLink) => {
              // Save new or updated link
              if (currentLinkData.name) {
                // If editing an existing link, update it
                const updatedLinks = socialLinks.map((link) =>
                  link.name === currentLinkData.name
                    ? { ...link, url: newLink.url }
                    : link
                );
                setSocialLinks(updatedLinks);
              } else {
                // If adding a new link, add it
                addLink(newLink);
              }
              setShowFormPopup(false); // Close the form after saving
            }}
            name={currentLinkData.name}
            url={currentLinkData.url}
            title={popupTitle} // ส่ง title ไปยัง SocialLinkFormPopup
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-[16px] border-zinc-300 border-b">
              <h2 className="text-[28px] font-semibold text-primary">
                ช่องทางการติดตาม
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                ✕
              </button>
            </div>

            <ul className="space-y-4 mb-5">
              {socialLinks.map((link, index) => (
                <SocialLinkItem
                  key={index}
                  name={link.name}
                  url={link.url}
                  icon={link.icon}
                  onUpdate={(newUrl) => {
                    const updatedLinks = [...socialLinks];
                    updatedLinks[index].url = newUrl;
                    setSocialLinks(updatedLinks);
                  }}
                  onEdit={handleEditLink} // Allow editing the link by clicking
                />
              ))}
            </ul>

            <div className="space-y-5">
              <AddSocialLinkButton
                icon={Images.InstagramIcon}
                label="เพิ่มลิงก์ Instagram"
                onClick={() =>
                  addLink({
                    name: "Instagram",
                    url: "https://instagram.com",
                    icon: Images.InstagramIcon,
                  })
                }
              />
              <AddSocialLinkButton
                icon={Images.XIcon}
                label="เพิ่มลิงก์ X"
                onClick={() =>
                  addLink({
                    name: "X",
                    url: "https://x.com",
                    icon: Images.XIcon,
                  })
                }
              />
              <AddSocialLinkButton
                icon={Images.TiktokIcon}
                label="เพิ่มลิงก์ TikTok"
                onClick={() =>
                  addLink({
                    name: "TikTok",
                    url: "https://tiktok.com",
                    icon: Images.TiktokIcon,
                  })
                }
              />
              {/* New button to add a new link */}
              <AddSocialLinkButton
                icon={Images.PlusIcon}
                label="เพิ่มลิงก์ใหม่"
                onClick={handleAddNewLink} // Open form with empty fields
              />
            </div>
          </>
        )}

        {!showFormPopup && (
          <div className="flex justify-end mt-6">
            <CloseButton onClose={onClose} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupSocialLinks;
