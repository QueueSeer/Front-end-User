import React, { useEffect, useState } from "react";

import PackageCard from "./PackageCard";
import PackageHeader from "./PackageHeader";
import axios from "axios";

const PackageSection = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const visiblePackages = 5; // ขยายเป็น 5 Card ต่อหน้า

    // โหลดข้อมูลแพ็คเกจจาก API
    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const params = new URLSearchParams();
            params.append("limit", 5);
            params.append("direction", "asc");
            const apiResponse = await fetch(`https://backend.qseer.app/api/seer/package/fortune/search?${params}`,{
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            }).then((res) => res.json())
            setPackages(apiResponse.packages);
            setLoading(false);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลแพ็คเกจ:", error);
            setError("ไม่สามารถโหลดข้อมูลแพ็คเกจได้");
            setLoading(false);
        }
    };  

    const nextSlide = () => {
        if (currentIndex < packages.length - visiblePackages) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (loading) {
        return <div className="p-12 translate-y-[-60px] text-center">กำลังโหลดข้อมูล...</div>;
    }

    if (error) {
        return <div className="p-12 translate-y-[-60px] text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-12 translate-y-[-60px]">
            <PackageHeader onPrev={prevSlide} onNext={nextSlide} currentIndex={currentIndex} totalPackages={packages.length} />
            <div className="overflow-hidden w-full">
                <div className="flex transition-transform duration-300 gap-6" style={{ transform: `translateX(-${currentIndex * 100 / visiblePackages}%)` }}>
                    {packages.map((pkg, index) => (
                        <PackageCard key={pkg.id} packageInfo={pkg} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PackageSection;