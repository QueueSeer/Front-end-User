import React, { useState, useEffect } from 'react';
import InfoUser from './InfoUser';
import images from '../../../assets';
import PopupEditProfile from '../../../components/Popup/profile/PopupEditProfile';
import axios from 'axios';

const ContentUser = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userData, setUserData] = useState({
    nickname: "",
    firstName: "",
    lastName: "",
    birthdate: "",
    email: "",
    phone: "",
    coins: 0,
    image: ""
  });

  // เริ่มต้นใช้รูปโปรไฟล์เริ่มต้น จะเปลี่ยนเมื่อโหลดข้อมูลจาก API สำเร็จ
  const [profileImage, setProfileImage] = useState(images.UserProfile);

  // ดึงข้อมูลผู้ใช้จาก API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://backend.qseer.app/api/user/me', {
          withCredentials: true
        });
        
        const data = response.data;
        console.log("User data received:", data);
        
        // แปลงข้อมูลจาก API เป็นรูปแบบที่ใช้ในคอมโพเนนต์
        setUserData({
          nickname: data.display_name || '',
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          birthdate: data.birthdate || '',
          email: data.email || '',
          phone: data.phone_number || '',
          coins: data.coins || 0,
          image: data.image || ''
        });
        
        // ตั้งค่ารูปโปรไฟล์ถ้ามี
        console.log("Profile image URL from API:", data.image);
          if (data.image && data.image.trim() !== '') {
            console.log("Setting profile image to:", data.image);
            setProfileImage(data.image);
          } else {
            console.log("No profile image from API, using default");
            setProfileImage(images.UserProfile);
          }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const toggleEditPopup = () => setIsEditOpen(!isEditOpen);

  // ฟังก์ชันอัปโหลดและเปลี่ยนรูปภาพ
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      
      // ในกรณีจริง คุณอาจต้องอัปโหลดรูปไปยังเซิร์ฟเวอร์ก่อน
      // แล้วค่อยอัปเดตข้อมูลผู้ใช้ด้วย URL ของรูปที่อัปโหลดแล้ว
      // ในตัวอย่างนี้ เราแค่เปลี่ยนรูปในหน้าจอเท่านั้น
    }
  };

  // ฟังก์ชันบันทึกข้อมูลผู้ใช้ที่แก้ไข
  const handleSaveUserData = (updatedData) => {
    console.log("Received updated data:", updatedData);
    
    // อัปเดตข้อมูลใน state
    setUserData({
      ...userData,
      nickname: updatedData.nickname,
      firstName: updatedData.firstName,
      lastName: updatedData.lastName,
      birthdate: updatedData.birthdate,
      phone: updatedData.phone
    });
  };

  if (isLoading && !userData.firstName) {
    return (
      <div className="py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
          onClick={() => window.location.reload()}
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 flex flex-col items-center lg:items-start space-y-8 lg:flex-row lg:space-y-0 lg:space-x-20 lg:px-8">
      <div className="flex-2 flex items-start">
        <div className="flex flex-col items-center relative">
          <div className="relative">
            {/* รูปโปรไฟล์ที่อัปเดต */}
            <img
              src={profileImage}
              alt="Profile"
              className="w-40 h-40 rounded-full border-2 border-purple-500 object-cover"
              onError={(e) => {
                console.log("Error loading profile image, using default");
                e.target.src = images.UserProfile;
              }}
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
      <PopupEditProfile 
        isOpen={isEditOpen} 
        onClose={toggleEditPopup} 
        userData={userData} 
        onSave={handleSaveUserData} 
      />
    </div>
  );
};

export default ContentUser;