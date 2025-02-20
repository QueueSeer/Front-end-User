// ContentUser.jsx
import React from 'react';
import InfoUser from './InfoUser';
import images from '../../../assets';

const ContentUser = () => {
  return (
    <div className="py-8 flex flex-col items-center lg:items-start space-y-8 lg:flex-row lg:space-y-0 lg:space-x-[100px] lg:px-[30px]">
      {/* Column 1 */}
      <div className="flex-2 flex items-start">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={images.UserProfile}
              alt="Profile Avatar"
              className="w-[200px] h-[200px] rounded-full border-2 border-purple-500"
            />
            {/* <button
              className="absolute bottom-0 right-0 bg-purple-500 text-white text-sm p-1 rounded-full"
              title="Edit"
            >
              ✎
            </button> */}
          </div>
          <div className="mt-4 text-center">
            <h1 className="text-[22px] font-semibold ">เพียงฟ้า พาชัย</h1>
          </div>
          {/* Buttons */}
          <div className="mt-3 flex flex-col gap-4 w-full">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-[16px] font-regular">
              แก้ไขโปรไฟล์
            </button>
            
          </div>
        </div>
      </div>

      {/* Column 2 */}
      <InfoUser />
    </div>
  );
};

export default ContentUser;
