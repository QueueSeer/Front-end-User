import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // เพิ่ม import useNavigate

import PackageCard from "./PackageCard";
import PackageHeader from "./PackageHeader";

const PackageSection = () => {
    const navigate = useNavigate(); // สร้าง instance navigate
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const visiblePackages = 5; // จำนวนแพ็คเกจที่แสดงในแต่ละหน้า (5 การ์ด)
    const cardGap = 16; // ระยะห่างระหว่างการ์ด (px)

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
                    // ... ข้อมูลอื่นๆ ...
                ]
            };
            
            try {
                const params = new URLSearchParams();
                params.append("limit", 15); // เพิ่มจำนวน limit เพื่อให้มีข้อมูลมากขึ้น
                params.append("direction", "asc");
                const apiResponse = await fetch(`https://backend.qseer.app/api/seer/package/fortune/search?${params}`,{
                    method: "GET",
                    headers: {
                        "Content-type": "application/json"
                    }
                }).then((res) => res.json());
                
                if (apiResponse.packages && apiResponse.packages.length > 0) {
                    setPackages(apiResponse.packages);
                } else {
                    // ถ้า API ไม่มีข้อมูล ใช้ข้อมูลจำลองแทน
                    setPackages(mockApiResponse.packages);
                }
            } catch (apiError) {
                console.error("API error:", apiError);
                // ถ้าเรียก API ไม่สำเร็จ ใช้ข้อมูลจำลองแทน
                setPackages(mockApiResponse.packages);
            }
            
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

    // ปุ่มถัดไป (Next)
    const nextSlide = () => {
        if (currentIndex < packages.length - visiblePackages) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // ปุ่มก่อนหน้า (Prev)
    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // ฟังก์ชันจัดการเมื่อคลิกที่การ์ด - แก้ไขให้นำทางไปยังหน้ารายละเอียดแพ็คเกจ
    const handleCardClick = (pkg) => {
        // นำทางไปยังหน้าจองหมอดู พร้อมส่งข้อมูลแพ็คเกจไปด้วย
        navigate("/bookingSeer", { 
            state: { 
                packageInfo: mapPackageToCardProps(pkg) 
            } 
        });
    };

    if (loading) {
        return <div className="p-12 translate-y-[-60px] text-center">กำลังโหลดข้อมูล...</div>;
    }

    if (error) {
        return <div className="p-12 translate-y-[-60px] text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-12 translate-y-[-60px]">
            <PackageHeader 
                onPrev={prevSlide} 
                onNext={nextSlide} 
                currentIndex={currentIndex} 
                totalPackages={packages.length} 
            />
            <div className="overflow-hidden w-full">
                <div 
                    className="flex transition-transform duration-300" 
                    style={{ 
                        gap: `${cardGap}px`,
                        transform: `translateX(-${currentIndex * (100 / visiblePackages)}%)`,
                        paddingRight: `${cardGap}px` // เพิ่ม padding ด้านขวาเพื่อป้องกันการ์ดสุดท้ายขาด
                    }}
                >
                    {packages.map((pkg) => (
                        <div 
                            key={pkg.id} 
                            className="flex-shrink-0 card-container" 
                            style={{ 
                                width: `calc((100% - ${cardGap * (visiblePackages - 1)}px) / ${visiblePackages})`,
                                cursor: 'pointer',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                            }}
                            onClick={() => handleCardClick(pkg)} // ส่งทั้งอ็อบเจ็กต์ pkg ไปให้ฟังก์ชัน handleCardClick
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <PackageCard packageInfo={mapPackageToCardProps(pkg)} />
                        </div>
                    ))}
                </div>
            </div>

            {/* CSS สำหรับ Hover Effect */}
            <style jsx>{`
                /* จัดการกับการ์ดภายใน */
                .card-container:hover > * {
                    border-color: #420F75;
                }
            `}</style>
        </div>
    );
};

export default PackageSection;