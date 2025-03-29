import React, { useState, useEffect } from "react";
import Images from "../../../assets";
import SeerHeader from "./SeerHeader";
import SeerCard from "./SeerCard";

const PopularSeers = () => {
    const [seers, setSeers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleSeersDesktop = 5; // Desktop แสดง 5 คน
    const visibleSeersMobile = 3; // มือถือแสดง 3 คน

    // โหลดข้อมูลหมอดูจาก API
    useEffect(() => {
        fetchPopularSeers();
    }, []);

    const fetchPopularSeers = async () => {
        try {
            setLoading(true);
            // สร้าง query params
            const params = new URLSearchParams();
            params.append("limit", 15); // เพิ่มจำนวนเพื่อให้มีข้อมูลสำหรับเลื่อน
            params.append("direction", "asc");
            params.append("is_available", true);
            // เรียงตามคะแนนมากไปน้อย (อาจต้องปรับตามความต้องการ)

            const response = await fetch(`https://backend.qseer.app/api/seer/search?${params}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("ไม่สามารถโหลดข้อมูลหมอดูได้");
            }

            const data = await response.json();
            console.log("ข้อมูลหมอดูที่ได้จาก API:", data);
            
            // ตรวจสอบและทำให้แน่ใจว่าข้อมูลที่ได้เป็น array
            if (Array.isArray(data)) {
                setSeers(data);
            } else if (data && Array.isArray(data.seers)) {
                // กรณี API อาจส่งข้อมูลในรูปแบบ { seers: [...] }
                setSeers(data.seers);
            } else {
                // กรณีไม่ได้รับข้อมูลในรูปแบบที่คาดหวัง
                throw new Error("รูปแบบข้อมูลที่ได้รับไม่ถูกต้อง");
            }
            
            setLoading(false);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลหมอดู:", error);
            
            // กรณีเกิดข้อผิดพลาด ใช้ข้อมูลจำลองแทน
            const mockSeers = [
                { id: 1, display_name: "หมอดูเพียงฟ้า พาขวัญ", primary_skill: "ศาสตร์ไพ่ยิปซี", rating: 4.0, review_count: 125 },
                { id: 2, display_name: "หมอดูเจนรบ", primary_skill: "โหราศาสตร์ไทย", rating: 4.5, review_count: 98 },
                { id: 3, display_name: "หมอเบียร์คนตื่นธรรม", primary_skill: "โหราศาสตร์", rating: 4.7, review_count: 203 },
                { id: 4, display_name: "หมอเจนนี่ ดวงดาว", primary_skill: "ศาสตร์ไพ่ยิปซี", rating: 4.2, review_count: 87 },
                { id: 5, display_name: "หมอดูภาลัย", primary_skill: "โหงวเฮ้ง", rating: 4.8, review_count: 156 },
                { id: 6, display_name: "หมอดูสุดารัตน์", primary_skill: "ศาสตร์ไพ่ยิปซี", rating: 4.1, review_count: 67 },
                { id: 7, display_name: "หมอมุกดา", primary_skill: "ไพ่ทาโรต์", rating: 4.3, review_count: 112 },
                { id: 8, display_name: "อาจารย์วิเชียร", primary_skill: "โหราศาสตร์ยูเรเนียน", rating: 4.6, review_count: 143 },
                { id: 9, display_name: "หมอพิมพ์นารา", primary_skill: "ศาสตร์ไพ่ยิปซี", rating: 4.2, review_count: 89 },
            ];
            
            setSeers(mockSeers);
            setError("ไม่สามารถโหลดข้อมูลหมอดูได้ แสดงข้อมูลจำลองแทน");
            setLoading(false);
        }
    };

    // แปลงข้อมูลจาก API ให้เข้ากับรูปแบบที่ SeerCard ต้องการ
    const mapSeerToCardProps = (seer) => {
        // ตรวจสอบว่า seer เป็น object และมีค่าก่อน
        if (!seer || typeof seer !== 'object') {
            return {
                id: 0,
                name: "ไม่มีข้อมูล",
                category: "",
                rating: 0,
                reviewCount: 0,
                image: null,
                isAvailable: false
            };
        }
        
        return {
            id: seer.id || 0,
            name: seer.display_name || "ไม่ระบุชื่อ",
            category: seer.primary_skill || "",
            rating: seer.rating !== undefined && seer.rating !== null ? seer.rating : 0,
            reviewCount: seer.review_count || 0,
            image: seer.image || null,
            isAvailable: seer.is_available !== undefined ? seer.is_available : false
        };
    };

    const nextSlide = () => {
        if (currentIndex < seers.length - visibleSeersDesktop) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (loading) {
        return (
            <div className="p-12 flex justify-center items-center">
                <p className="text-gray-500">กำลังโหลดข้อมูลหมอดู...</p>
            </div>
        );
    }

    if (error && seers.length === 0) {
        return (
            <div className="p-12 flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-12">
            {/* Header พร้อมปุ่มเลื่อน */}
            <SeerHeader 
                onPrev={prevSlide} 
                onNext={nextSlide} 
                currentIndex={currentIndex} 
                totalSeers={seers.length}
            />

            {error && (
                <div className="mb-4">
                    <p className="text-yellow-600 text-sm">{error}</p>
                </div>
            )}

            {/* Desktop: Slide ได้, มือถือ & iPad: Scroll ขวาได้ */}
            <div className="w-full">
                {/*  Desktop: Slide ได้, ไม่มี Scroll */}
                <div className="hidden md:block overflow-hidden">
                    <div 
                        className="flex transition-transform duration-300"
                        style={{ transform: `translateX(-${currentIndex * 100 / visibleSeersDesktop}%)` }}
                    >
                        {seers.map((seer, index) => (
                            <SeerCard 
                                key={seer.id || index} 
                                seer={mapSeerToCardProps(seer)} 
                            />
                        ))}
                    </div>
                </div>

                {/*  มือถือ & iPad: Scroll ขวาได้ */}
                <div className="md:hidden flex overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {seers.map((seer, index) => (
                        <SeerCard 
                            key={seer.id || index} 
                            seer={mapSeerToCardProps(seer)} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PopularSeers;