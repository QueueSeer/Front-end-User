import React from "react";
import Images from "../../../assets";

// Component รับ socialsLink และ socialsName จาก props
const SocialLinks = ({ socialsLink = "", socialsName = "" }) => {
  // ฟังก์ชันสำหรับระบุประเภทของโซเชียลมีเดียจาก URL
  const getSocialType = (url) => {
    if (!url) return null;
    
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com')) {
      return { type: 'facebook', icon: Images.Facebook2 };
    } else if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
      return { type: 'twitter', icon: Images.X };
    } else if (lowerUrl.includes('instagram.com')) {
      return { type: 'instagram', icon: Images.Instagram2 };
    } else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      return { type: 'youtube', icon: Images.youtobe };
    } else if (lowerUrl.includes('tiktok.com')) {
      return { type: 'tiktok', icon: Images.Tiktok };
    } else {
      // ถ้าไม่สามารถระบุประเภทได้ แสดงทุกไอคอน
      return null;
    }
  };
  
  // ตรวจสอบประเภทโซเชียลมีเดียจาก URL
  const socialType = getSocialType(socialsLink);
  
  // ฟังก์ชันจัดการคลิกโซเชียลมีเดีย
  const handleSocialClick = (url, type) => {
    if (url) {
      // ตรวจสอบว่า URL มี protocol หรือไม่
      let finalUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        finalUrl = 'https://' + url;
      }
      
      window.open(finalUrl, '_blank');
    }
  };

  // ถ้ามีลิงก์โซเชียลมีเดียเฉพาะ
  if (socialsLink && socialType) {
    return (
      <div className="mt-4">
        
        <div className="flex space-x-4">
          <img 
            src={socialType.icon} 
            alt={socialType.type} 
            className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => handleSocialClick(socialsLink, socialType.type)}
          />
        </div>
      </div>
    );
  }
  
  // ถ้ามีลิงก์แต่ไม่สามารถระบุประเภทได้
  if (socialsLink) {
    return (
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">ติดตามที่: {socialsName || "โซเชียลมีเดีย"}</p>
        <a 
          href={socialsLink.startsWith('http') ? socialsLink : `https://${socialsLink}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline"
        >
          {socialsLink}
        </a>
      </div>
    );
  }

 
};

export default SocialLinks;