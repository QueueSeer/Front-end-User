import React, { useEffect, useState } from 'react';
import Navbar from "../../components/navbar";
import Images from "../../assets";
import Sidebar from "../../components/Sidebar"; 
import axios from 'axios';


const FollowerPage = () => {
  const [followers, setFollowers] = useState([]);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const seerId = 1; // Example seer ID

  useEffect(() => {
    // Fetch total followers
    axios
      .get(`https://backend.qseer.app/api/seer/${seerId}/total_followers`)
      .then((response) => {
        setTotalFollowers(response.data.total_followers || 0);
      })
      .catch((error) => console.error("Error fetching total followers:", error));

    // Fetch followers list
    axios
      .get(`https://backend.qseer.app/api/seer/${seerId}/followers?last_id=0&limit=10`)
      .then((response) => {
        setFollowers(response.data.followers || []);
      })
      .catch((error) => console.error("Error fetching followers list:", error));
  }, [seerId]);

  return (
    <div className="min-h-screen dark:bg-gray-900 flex flex-col">
      {/* Navbar */}
     

      {/* Layout */}
      <div className="flex px-12 pt-12 gap-14">
        {/* Sidebar */}
        <div className="hidden lg:block w-72">
          <Sidebar active="ผู้ติดตาม" />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-4">
            <img src={Images.membericon} alt="Follower Icon" className="w-7 h-7" />
            <h1 className="text-xl font-bold" style={{ color: '#65558F' }}>ผู้ติดตาม</h1>
          </div>
          <hr className="border-gray-300 mb-4" />
          <p className="text-lg mb-6">
            <span className="font-bold" style={{ color: '#420F75', fontSize: '1rem' }}>
              จำนวนผู้ติดตาม - {totalFollowers}
            </span>
          </p>

          {/* Follower List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {followers.map((follower) => (
              <div key={follower.id} className="flex items-center space-x-4">
                <img
                  src={follower.image || Images.defaultAvatar} // Fallback image if no image provided
                  alt={follower.name}
                  className="w-16 h-16 rounded-full shadow-md"
                />
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{follower.name}</h2>
                  <p className="text-sm text-gray-600">@{follower.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowerPage;
