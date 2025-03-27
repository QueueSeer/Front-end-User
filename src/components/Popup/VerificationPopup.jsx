import React from 'react';

const VerificationPopup = ({ isOpen, onClose, email }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full animate-fade-in">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <svg className="h-10 w-10 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            ลงทะเบียนสำเร็จ!
          </h3>
          
          <div className="mt-4 mb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              กรุณาตรวจสอบอีเมล{email ? ` ${email}` : ''}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              เพื่อยืนยันการลงทะเบียนก่อนเข้าสู่ระบบ
            </p>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="w-full py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition duration-200"
            >
              ไปยังหน้าเข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPopup;