import React from "react";
import "./WaveAnimation.css"; // Import file CSS chứa hiệu ứng

const WaveAnimation = () => {
    return (
        <div className="wave-container">
            {[...Array(5)].map((_, index) => (
                <div key={index} className="wave-bar" style={{ animationDelay: `${index * 0.1}s` }}></div>
            ))}
        </div>
    );
};

export default WaveAnimation;
