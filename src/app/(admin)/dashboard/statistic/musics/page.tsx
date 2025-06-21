"use client";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MusicMetadataStats {
  categories: { [category: string]: number };
  tags: { [tag: string]: number };
}

const MusicStatistics = () => {
  const { user, accessToken } = useContext(AuthContext) ?? {};
  const [stats, setStats] = useState<MusicMetadataStats | null>(null);

  useEffect(() => {
    getMusicStatisticData();
  }, [accessToken, user]);

  const getMusicStatisticData = async () => {
    if (!accessToken || !user) {
      console.log("No access token or user, skipping API call");
      return;
    }
    try {
      const res = await sendRequest<IBackendRes<MusicMetadataStats>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/kafka/music-stats`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res?.data) {
        console.log("API Response:", res.data);
        setStats(res.data); // Lưu dữ liệu vào state
      }
    } catch (error) {
      console.error("Error fetching music stats:", error);
    }
  };

  // Cấu hình biểu đồ cho Categories
  const categoriesChartData = {
    labels: stats ? Object.keys(stats.categories) : [],
    datasets: [
      {
        label: "Categories",
        data: stats ? Object.values(stats.categories) : [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Cấu hình biểu đồ cho Tags
  const tagsChartData = {
    labels: stats ? Object.keys(stats.tags) : [],
    datasets: [
      {
        label: "Tags",
        data: stats ? Object.values(stats.tags) : [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Listens",
        },
      },
      x: {
        title: {
          display: true,
          text: "Categories / Tags",
        },
      },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Music Statistics</h1>

      <div
        style={{ marginBottom: "40px" }}
        className="h-80 flex justify-center"
      >
        <Bar
          data={categoriesChartData}
          options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: {
                display: true,
                text: "Music Categories Statistics",
              },
            },
          }}
        />
      </div>

      <div className="h-80 flex justify-center">
        <Bar
          data={tagsChartData}
          options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: {
                display: true,
                text: "Music Tags Statistics",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default MusicStatistics;
