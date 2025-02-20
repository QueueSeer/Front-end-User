import React from 'react';

const Loading = ({ isVisible = false, message = "กำลังดำเนินการ..." }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center z-50 dark:bg-gray-800 dark:bg-opacity-90">
      {/* Spinner */}
      <svg
        className="animate-spin h-12 w-12 text-purple-600 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
        ></path>
      </svg>

      {/* Loading Message */}
      <p className="text-gray-700 text-lg font-semibold">{message}</p>
    </div>
  );
};

export default Loading;
