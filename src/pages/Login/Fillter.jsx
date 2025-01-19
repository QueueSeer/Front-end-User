import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../assets";
import Fillterbar from "../../components/fillterbar";

export default function Fillter() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [step, setStep] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const lastStep = 2;
  const navigate = useNavigate();

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(matchMedia.matches);

    const handleChange = (e) => setIsDarkMode(e.matches);
    matchMedia.addEventListener("change", handleChange);

    return () => matchMedia.removeEventListener("change", handleChange);
  }, []);

  const tags = [
    "ไพ่ยิปซี",
    "โหราศาสตร์ไทย",
    "ศาสตร์ตัวเลข",
    "ไพ่ออราเคิล",
    "ไพ่พรหมญาณ",
    "ศาสตร์รูนส์",
    "ลายมือ",
    "โหราศาสตร์สากล",
    "โหราศาสตร์จีน",
    "โหงวเฮ้ง",
  ];

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? [] : [tag]
    );
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      setSelectedTags([]);
    } else if (step === lastStep) {
      navigate("/landing");
    }
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <Fillterbar />
      <div
        className={`flex h-screen font-sans lg:flex-row flex-col ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
        }`}
      >
        {/* ด้านซ้าย */}
        <div
          className={`w-full lg:w-1/2 relative flex flex-col p-8 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <div
            className={`absolute top-5 left-10 rounded-full w-96 h-96 ${
              isDarkMode ? "bg-yellow-300" : "bg-yellow-100"
            } opacity-40 blur-2xl hidden lg:block`}
          ></div>
          <div
            className={`absolute top-1/2 right-[25%] transform -translate-y-1/2 rounded-full w-96 h-96 ${
              isDarkMode ? "bg-purple-500" : "bg-purple-300"
            } opacity-40 blur-2xl hidden lg:block`}
          ></div>
          <div
            className={`absolute top-1/2 right-[1%] transform -translate-y-1/2 rounded-full w-96 h-96 ${
              isDarkMode ? "bg-purple-400" : "bg-purple-200"
            } opacity-40 blur-2xl hidden lg:block`}
          ></div>
          <img
            src={Images.marble}
            alt="marble"
            className="w-36 h-36 mx-auto mt-1 lg:absolute lg:top-[calc(50%-60px)] lg:right-[calc(30px)] lg:left-30 lg:transform lg:-translate-y-1/2 lg:translate-x-[calc(10px)] lg:w-[28rem] lg:h-[28rem] lg:mx-0"
          />
          <div className="relative z-10 ml-10 mt-10 hidden lg:block">
            <h2 className="text-2xl lg:text-4xl font-bold">
              เลือกเเท็กสำหรับคุณ
            </h2>
            <p className="text-lg lg:text-xl mt-4">รับการเเนะนำให้เหมาะกับคุณ</p>
          </div>
        </div>

        {/* ด้านขวา */}
        <div
          className={`w-full lg:w-1/2 flex flex-col justify-center items-center p-1 lg:p-8 -mt-10 lg:mt-0 mb-20 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <div
            className={`w-full max-w-lg p-6 md:p-10 shadow-md rounded-lg ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
          >
            {step === 1 ? (
              <>
                <h2 className="text-2xl font-bold mb-4 pt-5 text-center">
                  เลือกศาสตร์ดูดวงที่สนใจของคุณ
                </h2>
                <p className="text-center mt-2 mb-6 ">
                เลือกศาสตร์หมอดูที่คุณชื่นชอบ
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  {tags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-1.5 ${
                        selectedTags.includes(tag)
                          ? "bg-purple-500 text-white"
                          : isDarkMode
                          ? "bg-gray-600 text-gray-200"
                          : "bg-white text-gray-700"
                      } border ${
                        selectedTags.includes(tag)
                          ? "border-purple-500"
                          : isDarkMode
                          ? "border-gray-500"
                          : "border-gray-300"
                      } rounded-full hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4 pt-5 text-center">
                  เลือกเรื่องที่สนใจของคุณ
                </h2>
                <p className="text-center mt-2 mb-6">
                  เลือกเรื่องดูดวงที่คุณสนใจ
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  {[
                    "ความรัก",
                    "การงาน",
                    "การเงิน",
                    "สุขภาพ",
                    "ภาพรวม",
                    "ดวงรายเดือน",
                    "ดวงรายปี",
                    "เนื้อคู่",
                    "ค้นหาตัวตน",
                    "การเรียน",
                    "ย้ายงาน",
                    "อุปสรรค",
                    "อื่นๆ",
                  ].map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => toggleTag(topic)}
                      className={`px-4 py-1.5 ${
                        selectedTags.includes(topic)
                          ? "bg-purple-500 text-white"
                          : isDarkMode
                          ? "bg-gray-600 text-gray-200"
                          : "bg-white text-gray-700"
                      } border ${
                        selectedTags.includes(topic)
                          ? "border-purple-500"
                          : isDarkMode
                          ? "border-gray-500"
                          : "border-gray-300"
                      } rounded-full hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </>
            )}
            <div className="flex justify-end gap-4 mt-8">
              <button
                className={`px-6 py-2 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-600 text-white border-gray-500 hover:bg-gray-500"
                    : "bg-white text-gray-700 border border-[#65558F] hover:bg-gray-100"
                }`}
                onClick={() => {
                  if (step === 1) {
                    navigate("/login");
                  } else {
                    setStep(1);
                  }
                }}
              >
                ย้อนกลับ
              </button>
              <button
                className={`px-6 py-2 rounded-lg ${
                  isDarkMode
                    ? "bg-purple-500 hover:bg-purple-400 text-white"
                    : "bg-[#65558F] text-white hover:bg-[#4d4170]"
                }`}
                onClick={handleNext}
              >
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
