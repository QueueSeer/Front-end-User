import React from 'react';

const FollowerList = ({ followers }) => {
  return (
    <div className="space-y-4">
      {followers.map((follower) => (
        <div key={follower.id} className="flex items-center space-x-4">
          <img
            src={follower.image}
            alt={follower.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-purple-700"
          />
          <div>
            <p className="text-gray-800 font-medium">{follower.name}</p>
            <p className="text-sm text-gray-500">{follower.username}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowerList;
