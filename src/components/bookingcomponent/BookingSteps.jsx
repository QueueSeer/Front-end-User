import React from "react";
import { useLocation } from "react-router-dom";
import Images from "../../assets"; // Import ไอคอนจาก assets

const BookingSteps = () => {
  const location = useLocation();

  // 🔹 แก้ไขให้ path เป็นตัวพิมพ์เล็ก
  const stepMapping = {
    "/": 0,
    "/bookingSeer2": 1,
    "/bookingSeer3": 2,
    "/bookingSeer4": 3,
  };

  const currentStep = stepMapping[location.pathname] || 0;

  const steps = [
    { icon: Images.MoreDetails, activeIcon: Images.MoreDetails, label: "รายละเอียด" },
    { icon: Images.Fillinformation, activeIcon: Images.FillinformationActive, label: "กรอกข้อมูล" },
    { icon: Images.Visa, activeIcon: Images.VisaActive, label: "การจองคิว" },
    { icon: Images.finish, activeIcon: Images.finishActive, label: "เสร็จสิ้น" },
  ];

  return (
    <div className="flex flex-col items-center my-10 mt-8">
      <div className="flex justify-center space-x-16 relative w-full max-w-5xl">
        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-col items-center">
            {/* เส้นเชื่อมระหว่าง Step */}
            {index !== steps.length - 1 && (
              <div
                className={`absolute top-1/2 left-full transform -translate-y-1 -translate-x-3 w-20 h-1 ${
                  index < currentStep ? "bg-[#6B5B95]" : "bg-gray-300"
                }`}
              ></div>
            )}

            {/* วงกลม Step + เปลี่ยนสีเมื่อ Active */}
            <div
              className={`w-20 h-20 flex items-center justify-center rounded-full transition-all ${
                index === currentStep ? "bg-gray-300" : "bg-gray-300"
              }`}
            >
              <img
                src={index <= currentStep ? steps[index].activeIcon : steps[index].icon}
                alt={step.label}
                className="w-12 h-12"
              />
            </div>

            {/* Label */}
            <p className={`text-sm mt-3 text-center w-32 ${index <= currentStep ? "text-[#6B5B95] font-semibold" : "text-gray-700"}`}>
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingSteps;
