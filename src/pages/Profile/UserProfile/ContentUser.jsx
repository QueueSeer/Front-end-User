import React, { useState, useEffect } from 'react';
import InfoUser from './InfoUser';
import images from '../../../assets';
import PopupEditProfile from '../../../components/Popup/profile/PopupEditProfile';
import axios from 'axios';

const ContentUser = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
  
  useEffect(() => {
    fetchUserData();
  }, []);

  const toggleEditPopup = () => setIsEditOpen(!isEditOpen);

  // ฟังก์ชันอัปโหลดและเปลี่ยนรูปภาพ
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // ตรวจสอบขนาดไฟล์ (ไม่เกิน 10MB ตามข้อกำหนด API)
        if (file.size > 10 * 1024 * 1024) {
          alert("ขนาดไฟล์เกิน 10MB กรุณาเลือกไฟล์ที่มีขนาดเล็กกว่า");
          return;
        }
        
        // แสดงรูปทันทีในหน้าจอ (ก่อนที่จะอัปโหลดเสร็จ) - ช่วยให้ UI ตอบสนองเร็วขึ้น
        const imageUrl = URL.createObjectURL(file);
        setProfileImage(imageUrl);
        setIsUpdating(true);
        
        // บีบอัดรูปภาพก่อนอัปโหลดถ้าเป็นไปได้ (ทำในอนาคต)
        
        // อัปโหลดรูปผ่าน API พร้อมกำหนด timeout
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post('https://backend.qseer.app/api/image/user', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true,
          timeout: 30000 // กำหนด timeout 30 วินาที
        });
        
        console.log("Image upload response:", response.data);
        
        // สร้าง Event เพื่อแจ้งให้ Navbar ทราบว่ามีการอัปเดตรูปโปรไฟล์
        const profileUpdateEvent = new CustomEvent('profileImageUpdated', {
          detail: { imageUrl: response.data } // ส่ง URL รูปใหม่ไปด้วย
        });
        window.dispatchEvent(profileUpdateEvent);
        
        // อัปเดตข้อมูลในหน้า profile โดยไม่ต้องโหลดข้อมูลทั้งหมดใหม่
        // เพื่อความเร็วในการแสดงผล เราจะไม่เรียก fetchUserData() ทั้งหมด
        setUserData(prevData => ({
          ...prevData,
          image: response.data
        }));
        
      } catch (err) {
        console.error("Error uploading profile image:", err);
        alert("ไม่สามารถอัปโหลดรูปภาพได้ โปรดลองใหม่อีกครั้ง");
        // กลับไปใช้รูปเดิมหรือรูป default ถ้าอัปโหลดล้มเหลว
        setProfileImage(userData.image || images.UserProfile);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // ฟังก์ชันบันทึกข้อมูลผู้ใช้ที่แก้ไข
  const handleSaveUserData = async (updatedData) => {
    console.log("Received updated data:", updatedData);
    
    try {
      setIsUpdating(true);
      
      // เตรียมข้อมูลสำหรับส่งไปที่ API
      const requestData = {
        display_name: updatedData.nickname,
        first_name: updatedData.firstName,
        last_name: updatedData.lastName,
        birthdate: updatedData.birthdate,
        phone_number: updatedData.phone
      };
      
      // ส่งข้อมูลไปอัปเดตที่ API
      const response = await axios.patch('https://backend.qseer.app/api/user/me', requestData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Profile update response:", response.data);
      
      // อัปเดตข้อมูลใน state
      setUserData({
        ...userData,
        nickname: updatedData.nickname,
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        birthdate: updatedData.birthdate,
        phone: updatedData.phone
      });
      
      // ปิด popup หลังจากบันทึกสำเร็จ
      toggleEditPopup();
      
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("ไม่สามารถอัปเดตข้อมูลได้ โปรดลองใหม่อีกครั้ง");
    } finally {
      setIsUpdating(false);
    }
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
            {/* รูปโปรไฟล์ที่อัปเดต - ใช้ optimize image size */}
            <img
              src={profileImage}
              alt="Profile"
              className="w-40 h-40 rounded-full border-2 border-purple-500 object-cover"
              onError={(e) => {
                console.log("Error loading profile image, using default");
                e.target.src = images.UserProfile;
              }}
            />
            {/* โชว์ loading indicator เมื่อกำลังอัปโหลดรูป */}
            {isUpdating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            {/* ปุ่มแก้ไขโปรไฟล์ */}
            <label 
              className={`absolute bottom-2 right-2 bg-white border border-gray-300 rounded-full p-2 shadow-md flex items-center justify-center w-10 h-10 ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}`}
              title="เปลี่ยนรูปโปรไฟล์"
            >
              <img src={images.PencilIcon} alt="Edit" className="w-5 h-5" />
              <input 
                type="file" 
                accept="image/jpeg, image/png" 
                className="hidden" 
                onChange={handleImageUpload} 
                disabled={isUpdating}
              />
            </label>
          </div>
          <div className="mt-4 text-center">
            <h1 className="text-xl font-semibold">{userData.nickname}</h1>
          </div>
          <button 
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-lg mt-3"
            onClick={toggleEditPopup}
            disabled={isUpdating}
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
        isLoading={isUpdating}
      />
    </div>
  );
};

export default ContentUser;