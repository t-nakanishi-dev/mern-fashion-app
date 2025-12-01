// src/components/Admin/TopProductsChart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TopProductsChart = ({ token }) => {
  const [topProducts, setTopProducts] = useState([]);
  const [error, setError] = useState(null);

  // ダークモード対応（他のチャートと統一）
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/sales/top-products`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTopProducts(res.data);
      } catch (err) {
        console.error("人気商品取得エラー:", err);
        setError("人気商品の取得に失敗しました");
      }
    };

    if (token) fetchTopProducts();
  }, [token]);

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (topProducts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        売上データがまだありません
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border ${
        isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-gray-200"
      } backdrop-blur-md p-6`}
    >
      <h3 className="text-xl font-bold mb-6 text-purple-400">
        売れ筋商品ランキング TOP 10
      </h3>

      <ResponsiveContainer width="100%" height={380}>
        <BarChart
          data={topProducts}
          layout="vertical" // ← ここを vertical に戻す（これが正解！）
          margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke={isDark ? "#374151" : "#e5e7eb"}
            opacity={0.6}
          />

          {/* 縦バーの場合：Xが数値、Yがカテゴリ */}
          <XAxis
            type="number"
            tickFormatter={(value) => `${value.toLocaleString()}個`}
            tick={{ fill: isDark ? "#9ca3af" : "#6b7280", fontSize: 14 }}
            axisLine={false}
          />

          <YAxis
            type="category"
            dataKey="name"
            width={160}
            tick={{
              fill: isDark ? "#e5e7eb" : "#1f2937",
              fontSize: 13,
              fontWeight: 500,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: isDark
                ? "rgba(31, 41, 55, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
              border: `1px solid ${isDark ? "#4b5563" : "#e5e7eb"}`,
              borderRadius: "12px",
              fontSize: "14px",
              backdropFilter: "blur(8px)",
            }}
            formatter={(value) => `${value.toLocaleString()}個販売`}
            labelStyle={{ color: "#c084fc", fontWeight: "bold" }}
          />

          <Bar
            dataKey="totalSold"
            fill={isDark ? "#c084fc" : "#a78bfa"}
            barSize={28}
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* 総販売数表示 */}
      <div
        className={`mt-4 pt-4 border-t ${
          isDark ? "border-white/10" : "border-gray-200"
        } text-right`}
      >
        <span
          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          総販売数：
        </span>
        <span className="ml-2 text-lg font-bold text-purple-400">
          {topProducts
            .reduce((acc, cur) => acc + cur.totalSold, 0)
            .toLocaleString()}
          個
        </span>
      </div>
    </div>
  );
};

export default TopProductsChart;
