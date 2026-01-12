// src/components/Admin/CategorySalesChart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CategorySalesChart = ({ token }) => {
  const [categorySales, setCategorySales] = useState([]);
  const [error, setError] = useState(null);

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

  const COLORS = isDark
    ? ["#c084fc", "#ec4899", "#f472b6", "#f687b3", "#fcd34d"]
    : ["#a78bfa", "#e879f9", "#f0abfc", "#fdb4c4", "#fde047"];

  useEffect(() => {
    const fetchCategorySales = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/sales/category-sales`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // APIから来たデータが { category: "...", totalSales: ... } 形式と仮定
        setCategorySales(res.data);
      } catch (err) {
        console.error("カテゴリー別売上取得エラー:", err);
        setError("カテゴリー別売上の取得に失敗しました");
      }
    };

    if (token) fetchCategorySales();
  }, [token]);

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (categorySales.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        カテゴリー別売上データがまだありません
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
        カテゴリー別売上割合
      </h3>

      <ResponsiveContainer width="100%" height={340}>
        <PieChart>
          <Pie
            data={categorySales}
            dataKey="totalSales"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={110}
            paddingAngle={3}
            cornerRadius={12}
            label={({ category, percent }) =>
              `${category} ${(percent * 100).toFixed(0)}%`
            }
            labelStyle={{
              fontSize: "13px",
              fontWeight: "600",
              fill: isDark ? "#e5e7eb" : "#1f2937",
            }}
          >
            {categorySales.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke={isDark ? "#1f2937" : "#ffffff"}
                strokeWidth={3}
              />
            ))}
          </Pie>

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
            formatter={(value) => `¥${value.toLocaleString()}`}
            labelStyle={{ color: "#c084fc", fontWeight: "bold" }}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* 総売上（SalesChartと統一感を出すため右下に小さく） */}
      <div
        className={`mt-4 pt-4 border-t ${
          isDark ? "border-white/10" : "border-gray-200"
        } text-right`}
      >
        <span
          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          総売上：
        </span>
        <span className="ml-2 text-lg font-bold text-purple-400">
          ¥
          {categorySales
            .reduce((acc, cur) => acc + cur.totalSales, 0)
            .toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default CategorySalesChart;
