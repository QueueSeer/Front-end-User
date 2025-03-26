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
            // ข้อมูลจำลอง (mock data) สำหรับการพัฒนา
            const mockApiResponse = {
                packages: [
                    {
                        id: 1,
                        name: "ความรักในปีนี้จะเป็นอย่างไร",
                        category: "ดูดวงไพ่ยิปซี",
                        seer_id: 101,
                        seer_display_name: "หมอดูเพียงฟ้า พาขวัญ",
                        seer_image: null,
                        seer_rating: 4.0,
                        seer_review_count: 935,
                        price: "49.00",
                        duration: 15,
                        foretell_channel: "phone",
                        reading_type: "ไพ่ยิปซี",
                        status: "active",
                        image: null,
                        date_created: "2025-01-01T00:00:00Z"
                    },
                    {
                        id: 2,
                        name: "ภาพรวมดวงรายเดือนนี้",
                        category: "ดูดวงไพ่ยิปซี",
                        seer_id: 101,
                        seer_display_name: "หมอดูเพียงฟ้า พาขวัญ",
                        seer_image: null,
                        seer_rating: 4.0,
                        seer_review_count: 935,
                        price: "99.00",
                        duration: 15,
                        foretell_channel: "chat",
                        reading_type: "ไพ่ยิปซี",
                        status: "active",
                        image: null,
                        date_created: "2025-01-01T00:00:00Z"
                    },
                    {
                        id: 3,
                        name: "ความสัมพันธ์ไปต่อหรือพอแค่นี้",
                        category: "โหราศาสตร์ลัคกาล",
                        seer_id: 102,
                        seer_display_name: "หมอเบียร์คนตื่นธรรม",
                        seer_image: null,
                        seer_rating: 4.0,
                        seer_review_count: 935,
                        price: "199.00",
                        duration: 30,
                        foretell_channel: "video",
                        reading_type: "โหราศาสตร์",
                        status: "active",
                        image: null,
                        date_created: "2025-01-01T00:00:00Z"
                    },
                    {
                        id: 4,
                        name: "ดูดวงการงานในปีนี้",
                        category: "โหราศาสตร์ไทย",
                        seer_id: 103,
                        seer_display_name: "หมอดูเจนรบ",
                        seer_image: null,
                        seer_rating: 4.0,
                        seer_review_count: 935,
                        price: "59.00",
                        duration: 15,
                        foretell_channel: "phone",
                        reading_type: "โหราศาสตร์ไทย",
                        status: "active",
                        image: null,
                        date_created: "2025-01-01T00:00:00Z"
                    },
                    {
                        id: 5,
                        name: "ดวงการเงินเดือนนี้",
                        category: "ดูดวงไพ่ยิปซี",
                        seer_id: 104,
                        seer_display_name: "หมอดูภาลัย",
                        seer_image: null,
                        seer_rating: 4.5,
                        seer_review_count: 1020,
                        price: "79.00",
                        duration: 20,
                        foretell_channel: "chat",
                        reading_type: "ไพ่ยิปซี",
                        status: "active",
                        image: null,
                        date_created: "2025-01-01T00:00:00Z"
                    }
                ]
            };
            const params = new URLSearchParams();
            params.append("limit", 5);
            params.append("direction", "asc");
            const apiResponse = await fetch(`https://backend.qseer.app/api/seer/package/fortune/search?${params}`,{
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            }).then((res) => res.json())
            console.log(apiResponse)
            
            setPackages(mockApiResponse.packages);
            setPackages(apiResponse.packages);
            setLoading(false);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลแพ็คเกจ:", error);
            setError("ไม่สามารถโหลดข้อมูลแพ็คเกจได้");
            setLoading(false);
        }
    };

    // แปลงข้อมูลจาก API ให้เข้ากับรูปแบบที่ PackageCard ต้องการ
    const mapPackageToCardProps = (pkg) => ({
        id: pkg.id,
        title: pkg.name,
        category: pkg.category,
        seer: pkg.seer_display_name,
        rating: pkg.seer_rating || 0,
        reviews: pkg.seer_review_count,
        price: parseFloat(pkg.price),
        duration: pkg.duration,
        icon: pkg.foretell_channel === "chat" ? "chat" : 
              pkg.foretell_channel === "phone" ? "call" : "video",
        image: pkg.image,
        seerImage: pkg.seer_image
    });

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
                        <PackageCard key={pkg.id} packageInfo={mapPackageToCardProps(pkg)} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PackageSection;