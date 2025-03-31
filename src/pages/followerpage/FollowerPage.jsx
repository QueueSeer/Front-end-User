import React, { useEffect, useState } from 'react';
import Images from "../../assets";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/Sidebar";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FollowingPage = () => {
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);
  const [totalFollowing, setTotalFollowing] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('https://backend.qseer.app/api/user/me/follow', {
          params: { last_id: 0, limit: 20 },
          withCredentials: true
        });

        if (response.data && response.data.following) {
          setFollowing(response.data.following);
          setTotalFollowing(response.data.following.length);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching following list:", err);
        setError("ไม่สามารถโหลดรายการหมอดูที่คุณติดตามได้");
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

  useEffect(() => {
    const fetchSeerDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const updatedFollowing = await Promise.all(
          following.map(async (seer) => {
            try {
              const res = await axios.get(`https://backend.qseer.app/api/seer/${seer.id}`, {
                withCredentials: true
              });
              return { ...seer, primary_skill: res.data.primary_skill };
            } catch (err) {
              console.error(`Error fetching details for seer ${seer.id}:`, err);
              return seer;
            }
          })
        );

        setFollowing(updatedFollowing);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching seer details:", err);
        setError("ไม่สามารถโหลดข้อมูลหมอดูเพิ่มเติมได้");
        setLoading(false);
      }
    };

    if (following.length > 0) {
      fetchSeerDetails();
    }
  }, [following]);

  return (
    <div className="min-h-screen dark:bg-gray-900 flex flex-col">
      <Navbar />
      <div className="flex px-12 pt-12 gap-14">
        <div className="hidden lg:block w-72">
          <Sidebar active="กำลังติดตาม" />
        </div>
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <img src={Images.Users_GroupIcon} alt="Following Icon" className="w-7 h-7" />
            <h1 className="text-xl font-bold" style={{ color: '#65558F' }}>กำลังติดตาม</h1>
          </div>
          <hr className="border-gray-300 mb-4" />
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-2"></div>
              <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          {!loading && !error && (
            <>
              <p className="text-lg mb-6">
                <span className="font-bold" style={{ color: '#420F75', fontSize: '1rem' }}>
                  หมอดูที่ฉันติดตาม - {totalFollowing} คน
                </span>
              </p>
              {following.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">คุณยังไม่ได้ติดตามหมอดูคนไหนเลย</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    onClick={() => window.location.href = '/search-booking-seer'}
                  >
                    ค้นหาหมอดู
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {following.map((seer) => (
                    <div 
                      key={seer.id} 
                      className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100 shadow-sm"
                      onClick={() => navigate(`/qseerSchedulePage/${seer.id}`, { state: { seer } })}
                    >
                      <img
                        src={seer.image || Images.defaultAvatar}
                        alt={seer.display_name}
                        className="w-16 h-16 rounded-full shadow-md object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = Images.defaultAvatar;
                        }}
                      />
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">{seer.display_name}</h2>
                        <p className="text-sm text-gray-600">{seer.primary_skill || "ไม่ระบุ"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowingPage;
