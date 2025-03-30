import React, { useState } from "react";

import Images from "../../../assets";

const SeerRating = ({ rating }) => {
    
    return (
        <div className="flex items-center mb-1">
            {[...Array(5)].map((_, i) => (
                <img key={i} src={i < rating ? Images.RatingStarColor : Images.RatingStar} alt="rating" className="w-4 h-4" />
            ))}
        </div>
    );
};
export default SeerRating;