"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { ArrowUp, ArrowDown, RefreshCw } from "lucide-react";

// Dynamically import Line from react-chartjs-2
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Fetch crypto price history
const fetcher = (url: string) => fetch(url).then((res) => res.json());

type TimeRange = "24h" | "7d" | "30d" | "90d" | "1y";

export default function CryptoChart({ coin }: { coin: string | undefined }) {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [priceChange, setPriceChange] = useState<{
    value: number;
    percent: number;
  }>({ value: 0, percent: 0 });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  if (!coin) {
    return (
      <div className="text-gray-500 text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
        Please select a cryptocurrency.
      </div>
    );
  }

  const { data, error, mutate } = useSWR(
    `/api/crypto/${coin}?range=${timeRange}`,
    fetcher,
    {
      refreshInterval: 60 * 1000, // Refresh every minute
      onSuccess: (data) => setLastUpdated(new Date()),
    }
  );

  useEffect(() => {
    if (data?.Data?.Data?.length > 1) {
      const priceData = data.Data.Data;
      const firstPrice = priceData[0].close;
      const lastPrice = priceData[priceData.length - 1].close;
      const change = lastPrice - firstPrice;
      const percentChange = (change / firstPrice) * 100;

      setPriceChange({
        value: change,
        percent: percentChange,
      });
    }
  }, [data]);

  const handleRefresh = () => {
    mutate();
  };

  if (error)
    return (
      <div className="text-red-500 text-center p-4 rounded-lg bg-red-50 border border-red-200">
        ⚠️ Failed to load {coin.toUpperCase()} data. Please try again later.
      </div>
    );

  if (!data || !data.Data || !data.Data.Data)
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        <p className="mt-4 text-gray-500">
          Loading {coin.toUpperCase()} data...
        </p>
      </div>
    );

  const formatXAxisLabel = (timestamp: number) => {
    const date = new Date(timestamp * 1000);

    switch (timeRange) {
      case "24h":
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "7d":
        return date.toLocaleDateString([], {
          month: "short",
          day: "numeric",
        });
      case "30d":
      case "90d":
        return date.toLocaleDateString([], {
          month: "short",
          day: "numeric",
        });
      case "1y":
        return date.toLocaleDateString([], {
          month: "short",
          year: "2-digit",
        });
      default:
        return date.toLocaleDateString();
    }
  };

  const priceData = data.Data.Data;
  const labels = priceData.map((entry: any) => formatXAxisLabel(entry.time));
  const prices = priceData.map((entry: any) => entry.close);
  const currentPrice = prices[prices.length - 1];

  // Determine color based on price trend
  const trendColor = priceChange.percent >= 0 ? "#10b981" : "#ef4444";
  const gradientColor =
    priceChange.percent >= 0
      ? "rgba(16, 185, 129, 0.1)"
      : "rgba(239, 68, 68, 0.1)";

  const chartData = {
    labels,
    datasets: [
      {
        label: `${coin.toUpperCase()} Price (USD)`,
        data: prices,
        borderColor: trendColor,
        backgroundColor: gradientColor,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: trendColor,
        pointHoverBackgroundColor: trendColor,
        pointBorderColor: "#fff",
        pointHoverBorderColor: "#fff",
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Calculate appropriate number of x-axis ticks based on time range
  const getMaxTicksLimit = () => {
    switch (timeRange) {
      case "24h":
        return 6;
      case "7d":
        return 7;
      case "30d":
        return 10;
      case "90d":
        return 12;
      case "1y":
        return 12;
      default:
        return 8;
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        displayColors: false,
        callbacks: {
          title: function (tooltipItems: any) {
            const idx = tooltipItems[0].dataIndex;
            const timestamp = priceData[idx].time;
            const date = new Date(timestamp * 1000);

            if (timeRange === "24h") {
              return date.toLocaleString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            } else {
              return date.toLocaleDateString([], {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              });
            }
          },
          label: function (context: any) {
            return `$${context.raw.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: getMaxTicksLimit(),
          font: {
            size: 11,
          },
        },
      },
      y: {
        position: "right",
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: function (value: any) {
            return (
              "$" +
              value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            );
          },
          font: {
            size: 11,
          },
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    hover: {
      mode: "index",
      intersect: false,
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {coin.toUpperCase()}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold">
              $
              {currentPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <div
              className={`flex items-center ${priceChange.percent >= 0 ? "text-green-500" : "text-red-500"
                }`}
            >
              {priceChange.percent >= 0 ? (
                <ArrowUp size={16} />
              ) : (
                <ArrowDown size={16} />
              )}
              <span className="font-medium">
                {priceChange.percent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Refresh data"
          >
            <RefreshCw size={18} />
          </button>
          <div className="text-xs text-gray-500">
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="flex space-x-2 mb-4">
        {(["24h", "7d", "30d", "90d", "1y"] as TimeRange[]).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${timeRange === range
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {range}
          </button>
        ))}
      </div>

      <div className="h-64">
        <Line data={chartData} options={chartOptions} />
      </div>
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="Close Chart"
      >
        X
      </button>
    </div>
  );
}
