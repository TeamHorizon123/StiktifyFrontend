"use client"

import React, { useEffect, useState } from "react";

interface CircularProgressProps {
    progress: number; // Giá trị % từ 0 - 100
    size?: number; // Kích thước vòng tròn
    strokeWidth?: number; // Độ dày của đường kẻ
    speed?: number; // Tốc độ cập nhật (ms)
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    progress,
    size = 100,
    strokeWidth = 8,
    speed = 30, // Mỗi lần cập nhật cách nhau 30ms
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    const [animatedProgress, setAnimatedProgress] = useState(0);

    useEffect(() => {
        let currentProgress = animatedProgress;
        const step = progress > animatedProgress ? 1 : -1; // Xác định hướng

        if (currentProgress !== progress) {
            const interval = setInterval(() => {
                currentProgress += step;
                setAnimatedProgress(currentProgress);
                if (currentProgress === progress) clearInterval(interval);
            }, speed);

            return () => clearInterval(interval);
        }
    }, [progress, speed]);
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Vòng tròn nền */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#ddd"
                strokeWidth={strokeWidth}
                fill="none"
            />
            {/* Vòng tròn tiến trình */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#22a6b3"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`} // Xoay từ trên xuống

            />
            {/* Hiển thị phần trăm ở giữa */}
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy="0.3em"
                fontSize="12px"
                fontWeight="bold"
                fill="black"
            >
                {Math.round(progress)}%
            </text>
        </svg>
    );
};

export default CircularProgress;
