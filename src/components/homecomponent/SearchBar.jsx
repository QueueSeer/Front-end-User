import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../assets";

// รับ props seersData และ packagesData จาก Homepage
const SearchBar = ({ seersData = [], packagesData = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState({
    seers: [],
    packages: [],
    categories: []
  });
  const [showResults, setShowResults] = useState(false);
  const searchResultsRef = useRef(null);
  const navigate = useNavigate();

  // ฟังก์ชันค้นหาข้อมูลจากข้อมูลที่ได้รับจาก props
  const searchLocalData = (query) => {
    if (!query || query.trim() === "") {
      setSearchResults({ seers: [], packages: [], categories: [] });
      return;
    }

    const queryLower = query.toLowerCase();

    // ค้นหาหมอดูที่ตรงกับคำค้นหา
    const filteredSeers = seersData.filter(seer => 
      seer && seer.display_name && seer.display_name.toLowerCase().includes(queryLower)
    );

    // ค้นหาแพ็คเกจที่ตรงกับคำค้นหา
    const filteredPackages = packagesData.filter(pkg => 
      pkg && (
        (pkg.name && pkg.name.toLowerCase().includes(queryLower)) ||
        (pkg.seer_display_name && pkg.seer_display_name.toLowerCase().includes(queryLower))
      )
    );

    // รวบรวมหมวดหมู่ที่ไม่ซ้ำกัน
    const uniqueCategories = [...new Set(packagesData
      .filter(pkg => pkg && pkg.category)
      .map(pkg => pkg.category))]
      .filter(category => category && category.toLowerCase().includes(queryLower));

    // อัปเดตผลลัพธ์
    setSearchResults({
      seers: filteredSeers,
      packages: filteredPackages,
      categories: uniqueCategories
    });
  };

  // เมื่อมีการพิมพ์ค้นหา
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        searchLocalData(searchTerm);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, seersData, packagesData]);

  // จัดการคลิกนอก dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // จัดการคลิกที่หมอดู - ปรับให้สอดคล้องกับแอปพลิเคชัน
  const handleSeerClick = (seer) => {
    setShowResults(false);
    navigate("/qseerSchedulePage", { state: { seer } });
  };

  // จัดการคลิกที่แพ็คเกจ
  const handlePackageClick = (pkg) => {
    setShowResults(false);
    navigate("/bookingSeer", { state: { packageInfo: pkg } });
  };

  // จัดการคลิกที่หมวดหมู่ - ปรับให้แสดงเฉพาะหมอดูและแพ็คเกจในหมวดหมู่นั้น
  const handleCategoryClick = (category) => {
    setShowResults(false);
    // นำทางไปยังหน้าค้นหาพร้อมกับพารามิเตอร์หมวดหมู่
    navigate(`/search`, { 
      state: { 
        categoryFilter: category,
        seers: seersData.filter(seer => 
          seer && seer.primary_skill && seer.primary_skill === category
        ),
        packages: packagesData.filter(pkg => 
          pkg && pkg.category && pkg.category === category
        )
      } 
    });
  };

  // ฟังก์ชันสำหรับการค้นหาเมื่อกดปุ่ม
  const handleSearch = () => {
    if (searchTerm) {
      // นำทางไปยังหน้าค้นหาพร้อมกับผลลัพธ์การค้นหา
      navigate(`/search`, { 
        state: { 
          searchTerm,
          searchResults: {
            seers: searchResults.seers,
            packages: searchResults.packages,
            categories: searchResults.categories
          }
        } 
      });
      setShowResults(false);
    }
  };

  // ฟังก์ชันแสดงเรตติ้งอย่างปลอดภัย
  const displayRating = (rating) => {
    if (rating === null || rating === undefined) return "-";
    return typeof rating === 'number' ? rating.toFixed(1) : rating;
  };

  return (
    <div className="relative -mt-16 flex justify-center w-full max-w-3xl mx-auto border-2 rounded-lg overflow-visible shadow-xl bg-white p-3 
      sm:p-2 sm:max-w-xl md:max-w-3xl z-20">
      
      {/* ไอคอน Search */}
      <div className="flex items-center px-3 bg-white border-r 
        sm:px-2 sm:w-10 sm:flex sm:items-center">
        <img src={Images.Searchicon} alt="Search" className="w-6 h-6 sm:w-5 sm:h-5 text-gray-500 sm:block" />
      </div>

      {/* ช่อง Input */}
      <input
        type="text"
        placeholder="ชื่อหมอดู, แพคเกจ, หมวดหมู่"
        className="p-3 flex-grow text-gray-500 focus:outline-none 
        sm:p-2 sm:text-sm"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => {
          if (searchTerm) setShowResults(true);
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />

      {/* ปุ่มค้นหา */}
      <button 
        className="bg-purple-900 text-white px-6 py-2 font-semibold rounded-lg 
        sm:px-3 sm:py-1 sm:text-sm"
        onClick={handleSearch}
      >
        ค้นหา
      </button>

      {/* ส่วนแสดงผลลัพธ์การค้นหา */}
      {showResults && searchTerm && (
        <div 
          ref={searchResultsRef}
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-xl max-h-96 overflow-auto z-30"
        >
          {/* ไม่มีผลลัพธ์ */}
          {searchResults.seers.length === 0 && 
           searchResults.packages.length === 0 && 
           searchResults.categories.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              ไม่พบผลลัพธ์สำหรับ "{searchTerm}"
            </div>
          )}

          {/* ผลลัพธ์หมอดู */}
          {searchResults.seers.length > 0 && (
            <div className="mb-3">
              <h3 className="text-sm font-semibold px-3 py-1 bg-gray-100 rounded-md">หมอดู</h3>
              {searchResults.seers.slice(0, 3).map((seer) => (
                <div 
                  key={`seer-${seer.id}`}
                  className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                  onClick={() => handleSeerClick(seer)}
                >
                  <img 
                    src={seer.image || Images.profileSmall} 
                    alt={seer.display_name}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                    onError={(e) => {
                      e.target.src = Images.profileSmall;
                    }}
                  />
                  <div>
                    <p className="font-medium">{seer.display_name}</p>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600 mr-2">
                        {seer.primary_skill || "ไม่ระบุทักษะ"}
                      </span>
                      {/* ตรวจสอบค่า rating ก่อนใช้ toFixed */}
                      {seer.rating !== undefined && seer.rating !== null && (
                        <>
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="text-gray-600">{displayRating(seer.rating)}</span>
                          {seer.review_count !== undefined && (
                            <span className="text-gray-500 text-xs ml-1">
                              ({seer.review_count || 0} รีวิว)
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {searchResults.seers.length > 3 && (
                <div className="text-center py-2">
                  <button 
                    className="text-sm text-purple-900 hover:underline"
                    onClick={() => {
                      navigate(`/search`, { 
                        state: { 
                          searchTerm,
                          filterType: "seers",
                          searchResults: {
                            seers: searchResults.seers,
                            packages: [],
                            categories: []
                          } 
                        } 
                      });
                      setShowResults(false);
                    }}
                  >
                    แสดงหมอดูทั้งหมด ({searchResults.seers.length})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ผลลัพธ์แพ็คเกจ */}
          {searchResults.packages.length > 0 && (
            <div className="mb-3">
              <h3 className="text-sm font-semibold px-3 py-1 bg-gray-100 rounded-md">แพ็คเกจ</h3>
              {searchResults.packages.slice(0, 3).map((pkg) => (
                <div 
                  key={`package-${pkg.id}`}
                  className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                  onClick={() => handlePackageClick(pkg)}
                >
                  <img 
                    src={pkg.image || Images.tarot} 
                    alt={pkg.name}
                    className="w-12 h-12 rounded-md mr-3 object-cover"
                    onError={(e) => {
                      e.target.src = Images.tarot;
                    }}
                  />
                  <div className="flex-grow">
                    <p className="font-medium">{pkg.name}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {pkg.seer_display_name || "ไม่ระบุหมอดู"} • {pkg.category || "ไม่ระบุหมวดหมู่"}
                      </span>
                      <span className="text-sm font-medium text-purple-900">{pkg.price || "-"} คอยน์</span>
                    </div>
                  </div>
                </div>
              ))}
              {searchResults.packages.length > 3 && (
                <div className="text-center py-2">
                  <button 
                    className="text-sm text-purple-900 hover:underline"
                    onClick={() => {
                      navigate(`/search`, { 
                        state: { 
                          searchTerm,
                          filterType: "packages",
                          searchResults: {
                            seers: [],
                            packages: searchResults.packages,
                            categories: []
                          } 
                        } 
                      });
                      setShowResults(false);
                    }}
                  >
                    แสดงแพ็คเกจทั้งหมด ({searchResults.packages.length})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ผลลัพธ์หมวดหมู่ */}
          {searchResults.categories.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold px-3 py-1 bg-gray-100 rounded-md">หมวดหมู่</h3>
              <div className="flex flex-wrap gap-2 p-3">
                {searchResults.categories.map((category, index) => (
                  <span 
                    key={`category-${index}`}
                    className="bg-purple-100 text-purple-900 px-3 py-1 rounded-full text-sm hover:bg-purple-200 cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;