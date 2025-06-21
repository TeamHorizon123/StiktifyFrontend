"use client";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import React, { useContext, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UserStats {
  userId: string;
  totalActions: number;
  actionCounts: {
    listen?: number;
    view?: number;
    reaction?: number;
    follow?: number;
  };
}

interface HourlyStats {
  hour: string; 
  stats: UserStats[];
}

const UserStatistics = () => {
  const { user, accessToken } = useContext(AuthContext) ?? {};
  const [hourlyStats, setHourlyStats] = useState<HourlyStats[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("view_listen"); 

  useEffect(() => {
    getUserStatisticData();
  }, [accessToken, user]);

  const getUserStatisticData = async () => {
    if (!accessToken || !user) {
      console.log("No access token or user, skipping API call");
      return;
    }
    try {
      const res = await sendRequest<IBackendRes<HourlyStats[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/kafka/user-stats`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("API Response:", res?.data);
      if (res?.data) {
        console.log("Received hourly stats:", res.data);
        setHourlyStats(res.data);
      } else {
        console.log("No data received from API");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const aggregateActionsByHour = () => {
    const hourlyMap: {
      [hour: string]: {
        listen: number;
        view: number;
        reaction: number;
        follow: number;
      };
    } = {};

    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0");
      hourlyMap[hour] = { listen: 0, view: 0, reaction: 0, follow: 0 };
    }

    hourlyStats.forEach((hourStat) => {
      const hour = hourStat.hour.slice(11, 13); 
      const totals = hourlyMap[hour];
      hourStat.stats.forEach((userStat) => {
        totals.listen += userStat.actionCounts.listen || 0;
        totals.view += userStat.actionCounts.view || 0;
        totals.reaction += userStat.actionCounts.reaction || 0;
        totals.follow += userStat.actionCounts.follow || 0;
      });
    });


    const hourlyData = {
      hours: Object.keys(hourlyMap).sort(), 
      listen: Object.values(hourlyMap).map((data) => data.listen),
      view: Object.values(hourlyMap).map((data) => data.view),
      reaction: Object.values(hourlyMap).map((data) => data.reaction),
      follow: Object.values(hourlyMap).map((data) => data.follow),
    };

    console.log("Aggregated hourly actions:", hourlyData);
    return hourlyData;
  };

  const hourlyActions = aggregateActionsByHour();


  const chartData = [
    {
      title: "Listen Actions by Hour",
      action: "listen",
      data: {
        labels: hourlyActions.hours,
        datasets: [
          {
            label: "Listen",
            data: hourlyActions.listen,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
    },
    {
      title: "View Actions by Hour",
      action: "view",
      data: {
        labels: hourlyActions.hours,
        datasets: [
          {
            label: "View",
            data: hourlyActions.view,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
    },
    {
      title: "Reaction Actions by Hour",
      action: "reaction",
      data: {
        labels: hourlyActions.hours,
        datasets: [
          {
            label: "Reaction",
            data: hourlyActions.reaction,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
    },
    {
      title: "Follow Actions by Hour",
      action: "follow",
      data: {
        labels: hourlyActions.hours,
        datasets: [
          {
            label: "Follow",
            data: hourlyActions.follow,
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      },
    },
  ];

  const filteredChartData =
    selectedFilter === "view_listen"
      ? chartData.filter((chart) => ["view", "listen"].includes(chart.action))
      : chartData.filter((chart) =>
          ["follow", "reaction"].includes(chart.action)
        );

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
          text: "N.O Action",
        },
      },
      x: {
        title: {
          display: true,
          text: "Hour",
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center items-center">
        <h1 className="text-2xl font-bold mb-6 text-center pr-4">
          User Action Statistics
        </h1>
        <div className="mb-6 text-center">
          <label htmlFor="actionFilter" className="mr-2">
            Select Charts:
          </label>
          <select
            id="actionFilter"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="view_listen">View & Listen</option>
            <option value="follow_reaction">Follow & Reaction</option>
          </select>
        </div>
      </div>

      {hourlyStats.length === 0 ? (
        <p className="text-gray-500 text-center">
          No data available. Check console for errors.
        </p>
      ) : (
        <div className="space-y-6">
          {filteredChartData.map((chart, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
              data-title={chart.title}
            >
              <div className="h-96 pl-56">
                <Bar
                  data={chart.data}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: chart.title,
                      },
                    },
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserStatistics;
