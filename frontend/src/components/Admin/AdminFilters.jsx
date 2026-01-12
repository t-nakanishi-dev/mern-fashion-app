// src/components/Admin/AdminFilters.jsx
import React, { useEffect, useState } from "react";
import { Search, Filter, User, Clock } from "lucide-react";

const AdminFilters = ({ filters, setFilters, onFilterApply }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ダークモード検知
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

  return (
    <div
      className={`mb-8 rounded-2xl backdrop-blur-xl border transition-all duration-500 p-6 ${
        isDark
          ? "bg-white/5 border-white/10"
          : "bg-white/80 border-gray-200 shadow-xl"
      }`}
    >
      {/* オーブ光エフェクト */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-600 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          <Filter className="w-7 h-7 text-purple-400" />
          注文フィルター
        </h3>

        <div className="flex flex-wrap gap-6 items-end">
          {/* 日付順フィルター */}
          <div className="relative flex-1 min-w-[200px]">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 z-10" />
            <select
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              className={`w-full pl-12 pr-10 py-4 text-lg font-medium rounded-xl border-2 appearance-none transition-all duration-500 focus:ring-4 focus:ring-purple-500/40 cursor-pointer ${
                isDark
                  ? "bg-gray-700/75 border-purple-500 text-white hover:border-purple-400 shadow-lg shadow-purple-500/30 backdrop-blur-sm"
                  : "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 text-purple-900 hover:border-purple-500 shadow-md"
              }`}
              style={{ backgroundImage: "none" }}
            >
              <option value="desc">新しい順</option>
              <option value="asc">古い順</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className={`w-6 h-6 ${
                  isDark ? "text-pink-400" : "text-purple-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* ステータスフィルター */}
          <div className="relative flex-1 min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 z-10" />
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className={`w-full pl-12 pr-10 py-4 text-lg font-medium rounded-xl border-2 appearance-none transition-all duration-500 focus:ring-4 focus:ring-purple-500/40 cursor-pointer ${
                isDark
                  ? "bg-gray-700/75 border-purple-500 text-white hover:border-purple-400 shadow-lg shadow-purple-500/30 backdrop-blur-sm"
                  : "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 text-purple-900 hover:border-purple-500 shadow-md"
              }`}
              style={{ backgroundImage: "none" }}
            >
              <option value="">すべて</option>
              <option value="未処理">未処理</option>
              <option value="処理中">処理中</option>
              <option value="発送済み">発送済み</option>
              <option value="キャンセル">キャンセル</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className={`w-6 h-6 ${
                  isDark ? "text-pink-400" : "text-purple-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* ユーザー名検索 */}
          <div className="relative flex-1 min-w-[200px]">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 z-10" />
            <input
              type="text"
              name="userName"
              value={filters.userName}
              onChange={handleChange}
              placeholder="田中 など"
              className={`w-full pl-12 pr-4 py-4 text-lg rounded-xl border transition-all focus:ring-4 focus:ring-purple-500/20 ${
                isDark
                  ? "bg-white/10 border-white/20 text-white placeholder-gray-500 focus:border-purple-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 shadow-md"
              }`}
            />
          </div>

          {/* フィルタ適用ボタン */}
          <div>
            <button
              onClick={onFilterApply}
              className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/50"
            >
              フィルター適用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFilters;
