import React from "react";

const ConfirmPopup = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800">ยืนยันการทำรายการ</h2>
        <p className="text-gray-600 mt-2">{message}</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            onClick={onClose}
          >
            ยกเลิก
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            onClick={onConfirm}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
