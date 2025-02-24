import React, { useState } from 'react';
import InfoUser from './InfoUser';
import images from '../../../assets';
import PopupEditProfile from '../../../components/Popup/profile/PopupEditProfile';

const ContentUser = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const toggleEditPopup = () => setIsEditOpen(!isEditOpen);

  const [userData, setUserData] = useState({
    nickname: "พลอย",
    firstName: "สุรางคนางค์",
    lastName: "เกตุยั่งยืนวงศ์",
    birthdate: "2002-04-08",
    email: "64010936@gmail.com",
    phone: "0956966952",
  });

  const [profileImage, setProfileImage] = useState(images.UserProfile); // เก็บ URL ของรูปโปรไฟล์

  // ฟังก์ชันอัปโหลดและเปลี่ยนรูปภาพ
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="py-8 flex flex-col items-center lg:items-start space-y-8 lg:flex-row lg:space-y-0 lg:space-x-20 lg:px-8">
      <div className="flex-2 flex items-start">
        <div className="flex flex-col items-center relative">
          <div className="relative">
            {/* รูปโปรไฟล์ที่อัปเดต */}
            <img
              src={profileImage}
              alt="Profile"
              className="w-40 h-40 rounded-full border-2 border-purple-500"
            />
            {/* ปุ่มแก้ไขโปรไฟล์ */}
            <label 
              className="absolute bottom-2 right-2 bg-white border border-gray-300 rounded-full p-2 shadow-md flex items-center justify-center w-10 h-10 cursor-pointer"
              title="เปลี่ยนรูปโปรไฟล์"
            >
              <img src={images.PencilIcon} alt="Edit" className="w-5 h-5" />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </label>
          </div>
          <div className="mt-4 text-center">
            <h1 className="text-xl font-semibold">{userData.nickname}</h1>
          </div>
          <button 
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-lg mt-3"
            onClick={toggleEditPopup}
          >
            แก้ไขโปรไฟล์
          </button>
        </div>
      </div>

      <InfoUser userData={userData} />
      <PopupEditProfile isOpen={isEditOpen} onClose={toggleEditPopup} userData={userData} onSave={setUserData} />
    </div>
  );
};

export default ContentUser;
