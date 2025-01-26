import React from "react";
import Images from "../../assets"; // Replace with the correct path to your images

const Pagination = ({ currentPage, totalPages, onPrevious, onNext }) => {
  return (
    <div className="flex items-center justify-end mt-6 mb-4">
      <button
        onClick={onPrevious}
        className="p-2 mx-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700"
        disabled={currentPage === 1}
      >
        <img
          src={currentPage === 1 ? Images.backpage : Images.backstep}
          alt="Back Icon"
          className="w-10 h-10"
        />
      </button>
      <span className="text-gray-700 dark:text-gray-300">
        {currentPage} of {totalPages}
      </span>
      <button
        onClick={onNext}
        className="p-2 mx-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700"
        disabled={currentPage === totalPages}
      >
        <img
          src={Images.next}
          alt="Next Icon"
          className="w-10 h-10"
        />
      </button>
    </div>
  );
};

export default Pagination;
