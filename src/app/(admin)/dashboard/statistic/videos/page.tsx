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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface VideoMetadataStats {
  categories: { [category: string]: number };
  tags: { [tag: string]: number };
}

const VideoStatistics = () => {
  const { user, accessToken } = useContext(AuthContext) ?? {};
  const [stats, setStats] = useState<VideoMetadataStats | null>(null);

  useEffect(() => {
    getVideoStatisticData();
  }, [accessToken, user]);

  const getVideoStatisticData = async () => {
    if (!accessToken || !user) {
      console.log("No access token or user, skipping API call");
      return;
    }
    try {
      const res = await sendRequest<IBackendRes<VideoMetadataStats>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/kafka/video-stats`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res?.data) {
        console.log("API Response:", res.data);
        setStats(res.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const categoriesChartData = {
    labels: stats ? Object.keys(stats.categories) : [],
    datasets: [
      {
        label: "Categories",
        data: stats ? Object.values(stats.categories) : [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const tagsChartData = {
    labels: stats ? Object.keys(stats.tags) : [],
    datasets: [
      {
        label: "Tags",
        data: stats ? Object.values(stats.tags) : [],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
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
          text: "Number of Views",
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
      <h1>Video Statistics</h1>

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
                text: "Video Categories Statistics",
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
                text: "Video Tags Statistics",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default VideoStatistics;
