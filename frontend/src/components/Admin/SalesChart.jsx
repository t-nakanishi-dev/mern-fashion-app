// src/components/Admin/SalesChart.jsx
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

const SalesChart = ({ token }) => {
  const [monthlySales, setMonthlySales] = useState([]);
  const [error, setError] = useState(null);

  // ダークモード対応（AdminDashboardと統一）
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/sales/monthly`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const processedData = res.data.map((item) => ({
          month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
          totalSales: item.totalSales,
        }));
        setMonthlySales(processedData);
      } catch (err) {
        console.error("売上データ取得エラー:", err);
        setError("売上データの取得に失敗しました");
      }
    };

    if (token) fetchMonthlySales();
  }, [token]);

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (monthlySales.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        売上データがまだありません
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-gray-200"} backdrop-blur-md p-6`}>
      <h3 className="text-xl font-bold mb-6 text-purple-400">
        月別売上推移
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={monthlySales} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={isDark ? "#374151" : "#e5e7eb"} />
          
          <XAxis 
            dataKey="month" 
            tick={{ fill: isDark ? "#d1d5db" : "#4b5563" }}
            style={{ fontSize: "14px" }}
          />
          
          <YAxis 
            tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
            tick={{ fill: isDark ? "#9ca3af" : "#6b7280" }}
            style={{ fontSize: "14px" }}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "rgba(31, 41, 55, 0.95)" : "rgba(255, 255, 255, 0.95)",
              border: `1px solid ${isDark ? "#4b5563" : "#e5e7eb"}`,
              borderRadius: "12px",
              fontSize: "14px",
            }}
            formatter={(value) => `¥${value.toLocaleString()}`}
          />
          
          <Bar 
            dataKey="totalSales" 
            fill={isDark ? "#c084fc" : "#a78bfa"}
            radius={[8, 8, 0, 0]}
            barSize={28}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className={`mt-4 pt-4 border-t ${isDark ? "border-white/10" : "border-gray-200"} text-right`}>
        <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          期間合計：
        </span>
        <span className="ml-2 text-lg font-bold text-purple-400">
          ¥{monthlySales.reduce((acc, cur) => acc + cur.totalSales, 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default SalesChart;