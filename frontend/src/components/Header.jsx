import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import {
  Sun,
  Moon,
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  Package,
  Shield,
  Plus,
} from "lucide-react";

const Header = ({ handleLogout, userName, userRole, isDark, setIsDark }) => {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const NavLink = ({ to, icon, label, badge, admin }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-medium transition-all duration-300 ${
          active
            ? "bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/30"
            : "text-gray-300 hover:bg-white/10 hover:text-white"
        }`}
      >
        <div className="relative">
          {icon}
          {badge > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center font-bold">
              {badge}
            </span>
          )}
        </div>
        <span>{label}</span>
        {admin && (
          <span className="ml-2 px-2 py-1 text-xs bg-red-500/30 text-red-300 rounded-full">
            Admin
          </span>
        )}
      </Link>
    );
  };

  const MobileNavLink = ({ to, icon, label, badge, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center justify-between w-full p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          {icon}
          {badge > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {badge}
            </span>
          )}
        </div>
        <span className="text-lg">{label}</span>
      </div>
      <span className="text-gray-500">→</span>
    </Link>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-purple-500/20 backdrop-blur-2xl bg-gray-950/90 dark:bg-black/80 shadow-2xl">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* ロゴ PC */}
            <Link
              to="/"
              className="flex items-center gap-4 group hidden sm:flex"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/50 group-hover:scale-110 transition-all duration-300">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  FashionStore
                </h1>
              </div>
            </Link>
            {/* ロゴ モバイル */}
            <Link to="/" className="sm:hidden flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Package className="w-6 h-6 text-white m-2" />
              </div>
              <span className="text-xl font-bold text-white">FashionStore</span>
            </Link>

            {/* デスクトップナビ */}
            <nav className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all hover:scale-110"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-purple-300" />
                )}
              </button>
              <NavLink
                to="/favorites"
                icon={<Heart className="w-5 h-5" />}
                label="お気に入り"
              />
              <NavLink
                to="/cart"
                icon={<ShoppingCart className="w-5 h-5" />}
                label="カート"
                badge={itemCount}
              />
              {userName && (
                <NavLink
                  to="/profile"
                  icon={<User className="w-5 h-5" />}
                  label="プロフィール"
                />
              )}
              {userName && (
                <NavLink
                  to="/add"
                  icon={<Plus className="w-5 h-5" />}
                  label="商品追加"
                />
              )}
              {userRole === "admin" && (
                <NavLink
                  to="/admin"
                  icon={<Shield className="w-5 h-5" />}
                  label="管理画面"
                  admin
                />
              )}
            </nav>

            {/* 右側 */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-xs text-gray-400">Welcome back</p>
                <p className="font-bold text-purple-300">
                  {userName || "ゲスト"}
                </p>
              </div>
              {userName && (
                <button
                  onClick={handleLogout}
                  className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all hover:scale-110 group"
                >
                  <LogOut className="w-5 h-5 group-hover:rotate-12 transition" />
                </button>
              )}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-3 rounded-xl hover:bg-white/10 transition"
              >
                {menuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* モバイルメニュー（フルスクリーンオーバーレイ） */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMenuOpen(false)} // 外側クリックで閉じる
        >
          {/* メニュー本体（右寄せスライド） */}
          <div
            className="absolute top-0 right-0 bottom-0 w-4/5 max-w-xs bg-gray-950/95 backdrop-blur-2xl border-l border-purple-500/30 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="h-full overflow-y-auto px-6 py-8 space-y-5 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-gray-900/50 scrollbar-thumb-rounded-full">
              {/* ユーザー情報 */}
              <div className="flex items-center gap-4 pb-6 border-b border-purple-500/20">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center ring-4 ring-purple-500/30">
                  <User className="w-9 h-9 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-purple-300">
                    {userName || "ゲスト"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {userRole === "admin" ? "管理者" : "ユーザー"}
                  </p>
                </div>
              </div>

              {/* ダークモードボタン */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition"
              >
                <span className="flex items-center gap-3">
                  {isDark ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-purple-300" />
                  )}
                  <span className="text-lg">
                    {isDark
                      ? "ライトモードに切り替え"
                      : "ダークモードに切り替え"}
                  </span>
                </span>
                <span className="text-xs text-purple-400 font-medium">
                  {isDark ? "ダーク" : "ライト"}
                </span>
              </button>

              {/* メニューアイテム */}
              <MobileNavLink
                to="/favorites"
                icon={<Heart className="w-6 h-6" />}
                label="お気に入り一覧"
                onClick={() => setMenuOpen(false)}
              />
              <MobileNavLink
                to="/cart"
                icon={<ShoppingCart className="w-6 h-6" />}
                label="カート"
                badge={itemCount}
                onClick={() => setMenuOpen(false)}
              />
              {userName && (
                <MobileNavLink
                  to="/profile"
                  icon={<User className="w-6 h-6" />}
                  label="プロフィール"
                  onClick={() => setMenuOpen(false)}
                />
              )}
              {userName && (
                <MobileNavLink
                  to="/add"
                  icon={<Plus className="w-6 h-6" />}
                  label="商品を追加"
                  onClick={() => setMenuOpen(false)}
                />
              )}
              {userRole === "admin" && (
                <MobileNavLink
                  to="/admin"
                  icon={<Shield className="w-6 h-6" />}
                  label="管理者ページ"
                  admin
                  onClick={() => setMenuOpen(false)}
                />
              )}

              {/* ログアウト */}
              {userName && (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-4 p-5 bg-red-500/20 hover:bg-red-500/40 rounded-2xl text-red-300 transition"
                >
                  <LogOut className="w-6 h-6" />
                  <span className="font-medium text-lg">ログアウト</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ヘッダーの高さ分スペース（固定ヘッダー対策） */}
      <div className="h-20" />
    </>
  );
};

export default Header;
