import React from "react";
import icon from "../../assets"; // Import ไอคอนจาก assets

const Footer = () => {
  return (
    <div className="bg-[#8677A7] text-white py-8 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Footer Content */}
        <div className="w-full md:w-1/2 flex flex-wrap justify-around text-left mb-6 md:mb-0">
          {/* Company */}
          <div>
            <h4 className="text-[24px] font-semibold mb-2" style={{ fontFamily: "Noto Sans Thai" }}>
              Company
            </h4>
            <ul className="space-y-1 text-[18px] font-normal">
              <li>About Us</li>
              <li>Why Choose us</li>
              <li>Pricing</li>
              <li>Testimonial</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[24px] font-semibold mb-2" style={{ fontFamily: "Noto Sans Thai" }}>
              Resources
            </h4>
            <ul className="space-y-1 text-[18px] font-normal">
              <li>Privacy Policy</li>
              <li>Terms and Condition</li>
              <li>Blog</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[24px] font-semibold mb-2" style={{ fontFamily: "Noto Sans Thai" }}>
              Product
            </h4>
            <ul className="space-y-1 text-[18px] font-normal">
              <li>Booking</li>
              <li>Notification</li>
              <li>status</li>
              <li>Auction</li>
            </ul>
          </div>
        </div>

        {/* Qseer Text */}
        <div className="w-full md:w-1/2 text-center md:text-center">
          <h1 className="text-[48px] font-bold mb-2 mr-10" style={{ fontFamily: "Playfair Display" }}>
            Qseer
          </h1>
          <p className="text-[24px] font-semibold mb-1" style={{ fontFamily: "Noto Sans Thai" }}>
            เครื่องมือสำคัญสำหรับหมอดู
          </p>
          <p className="text-[18px] font-normal" style={{ fontFamily: "Noto Sans Thai" }}>
            ให้ Qseer ช่วยคุณจัดการคิวอย่างมืออาชีพ
          </p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="flex items-center justify-center mt-6  pt-6">
        {/* เส้นด้านซ้าย */}
        <div className="flex-1 border-t border-white"></div>

        {/* Copyright */}
        <div className="px-4 text-[18px] font-normal" style={{ fontFamily: "Noto Sans Thai" }}>
          Copyright ©2024
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center space-x-4 px-4">
          <img src={icon.Facebook} alt="Facebook" className="w-6 h-6 cursor-pointer hover:opacity-80" />
          <img src={icon.Instagram} alt="Instagram" className="w-6 h-6 cursor-pointer hover:opacity-80" />
          <img src={icon.Twitter} alt="Twitter" className="w-6 h-6 cursor-pointer hover:opacity-80" />
        </div>

        {/* เส้นด้านขวา */}
        <div className="flex-1 border-t border-white"></div>
      </div>
    </div>
  );
};

export default Footer;
