// src/components/Layout.jsx
import React from "react";
import Header from "./Header";
import LoadingOverlay from "./LoadingOverlay";
import { useLoading } from "../contexts/LoadingContext";

const Layout = ({
  userName,
  userRole,
  handleLogout,
  children,
  isDark,
  setIsDark,
}) => {
  const { loading } = useLoading();

  return (
    <div
      className={`min-h-screen transition-all duration-1000 ease-in-out ${
        isDark
          ? "bg-gradient-to-br from-gray-950 via-purple-950 to-slate-950"
          : "bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100"
      } text-gray-100 dark:text-gray-100 overflow-x-hidden`}
    >
      {/* 背景の動くオーブ（ダーク／ライトで完全切り替え） */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/20 blur-3xl" />
            <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-32 right-32 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-300/10 via-pink-200/10 to-blue-200/10 blur-3xl" />
            <div className="absolute top-20 left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-32 right-32 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-300/30 to-orange-300/20 rounded-full blur-3xl animate-pulse delay-500" />
          </>
        )}
      </div>

      {/* ローディングオーバーレイ */}
      {loading && <LoadingOverlay />}

      {/* ヘッダー（isDarkとsetIsDarkを渡す） */}
      <Header
        userName={userName}
        userRole={userRole}
        handleLogout={handleLogout}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      {/* メインコンテンツ */}
      <main
        className={`relative z-10 flex-grow px-6 py-10 max-w-7xl mx-auto w-full ${
          !isDark && "text-gray-800"
        }`}
      >
        <div className="animate-fadeIn">{children}</div>
      </main>

      {/* スタイリッシュなフッター */}
      <footer
        className={`relative z-10 border-t ${
          isDark
            ? "border-purple-500/20 bg-black/30"
            : "border-purple-200/50 bg-white/70"
        } backdrop-blur-xl py-8 mt-20`}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            © 2025{" "}
            <span
              className={`${
                isDark ? "text-purple-400" : "text-purple-600"
              } font-bold`}
            >
              {userName || "Guest"}
            </span>{" "}
            | Full-Stack Portfolio
          </p>
          <p
            className={`text-xs ${
              isDark ? "text-gray-500" : "text-gray-600"
            } mt-2`}
          >
            React × Firebase × Tailwind CSS × Vite
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
