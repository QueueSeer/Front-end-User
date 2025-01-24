import React from "react";
import Images from "../../assets";

const HeroSection = () => {
  return (
    <div className="relative w-full h-[460px] sm:h-[220px] md:h-[400px] 
                    bg-gradient-to-l from-[#65558F] via-[#7465A8] to-[#FFFFFF] 
                   flex flex-col md:flex-row items-center px-8 sm:px-6 md:px-16 py-10 sm:py-4">
      
      {/* ส่วนข้อความ */}
      <div className="flex-1 text-black text-center md:text-left sm:max-w-[65%] sm:px-2 sm:mb-1 translate-y-[60px] md:translate-y-0">

        <h1 className="text-4xl sm:text-xl md:text-5xl font-bold leading-tight sm:leading-snug ">
          สวัสดีวันอาทิตย์
        </h1>
        <p className="text-xl sm:text-base md:text-2xl mt-4 sm:mt-1">
          ดูดวงสะดวก จองคิวทันใจที่ Qseer
        </p>
      </div>

      {/* ส่วนรูปภาพ */}
      <div className="flex-1 flex justify-end w-full">
        {/* ภาพสำหรับ Desktop */}
        <img src={Images.Luckycolor} alt="Lucky Color" 
             className="hidden md:block w-[80%] sm:w-[70%] md:w-full h-auto max-w-none object-cover " />

        {/* ภาพสำหรับ โทรศัพท์/iPad */}
        <img src={Images.Luckycolor2} alt="Lucky Color Mobile" 
             className="block md:hidden w-[100%] sm:w-full h-auto max-w-none object-contain sm:-mt-4" />
      </div>
    </div>
  );
};

export default HeroSection;
