import { useState } from "react";
import AboutSection from "./AboutSection";
import PackagesSection from "./PackagesSection";
import ReviewsSection from "./ReviewsSection";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div>
      {/* เมนูแท็บ */}
      <div className="flex border-b border-gray-300 ">
        <button
          className={`py-2 px-4 text-lg font-semibold ${
            activeTab === "about" ? "text-black border-b-2 border-black" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("about")}
        >
          เกี่ยวกับเรา 
        </button>
        <button
          className={`py-2 px-4 text-lg font-semibold ${
            activeTab === "packages" ? "text-black border-b-2 border-black" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("packages")}
        >
          แพ็กเกจทั้งหมด
        </button>
        <button
          className={`py-2 px-4 text-lg font-semibold ${
            activeTab === "reviews" ? "text-black border-b-2 border-black" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          รีวิว
        </button>
      </div>

      {/* แสดงคอนเทนต์ของแท็บที่เลือก */}
      <div className="mt-5 w-full">
        {activeTab === "about" && <AboutSection />}
        {activeTab === "packages" && <PackagesSection />}
        {activeTab === "reviews" && <ReviewsSection />}
      </div>
    </div>
  );
};

export default ProfileTabs;
