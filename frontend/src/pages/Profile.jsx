// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  User,
  Package,
  ShoppingBag,
  Edit3,
  Save,
  CheckCircle,
} from "lucide-react";

const Profile = () => {
  const { user, token, setUserName } = useAuth();
  const [name, setName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [message, setMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [myProducts, setMyProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState(null);

  const [stockEdits, setStockEdits] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const isDark = document.documentElement.classList.contains("dark");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setOriginalName(user.name || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchMyProducts = async () => {
      if (!token) return;
      try {
        setLoadingProducts(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/mine`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMyProducts(res.data);
        setProductError(null);
      } catch (err) {
        console.error("自分の商品一覧取得エラー:", err);
        setProductError("商品一覧の取得に失敗しました。");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchMyProducts();
  }, [token]);

  const validateName = (input) => {
    if (!input.trim()) {
      setNameError("名前は空にできません");
      return false;
    }
    setNameError("");
    return true;
  };

  const handleUpdate = async () => {
    if (!validateName(name)) return;
    if (name === originalName) {
      setMessage("変更内容がありません");
      return;
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${user.uid}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("名前を更新しました！");
      setOriginalName(name);
      setUserName(name);
      setIsEditing(false);
    } catch (error) {
      setMessage("名前の更新に失敗しました");
    }
  };

  const handleSaveStock = async (productId) => {
    const newStock = Number(stockEdits[productId]);
    if (isNaN(newStock) || newStock < 0) {
      alert("在庫数は0以上の整数で入力してください");
      return;
    }

    try {
      setUpdatingId(productId);
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/products/${productId}/stock`,
        { countInStock: newStock },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, countInStock: newStock } : p
        )
      );
      setStockEdits((prev) => ({ ...prev, [productId]: "" }));
      setMessage("在庫を更新しました");
    } catch (err) {
      alert("在庫の更新に失敗しました");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダーエリア */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 p-1 shadow-2xl shadow-purple-500/50 mb-8">
            <div className="w-full h-full rounded-full bg-black/50 backdrop-blur-xl flex items-center justify-center">
              <User className="w-20 h-20 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            マイページ
          </h1>
          <p
            className={`text-xl ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {user?.email}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* 左側：プロフィール編集 */}
          <div className="lg:col-span-1">
            <div
              className={`rounded-3xl p-8 backdrop-blur-xl border ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white/90 border-gray-200 shadow-2xl"
              }`}
            >
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Edit3 className="w-8 h-8 text-purple-400" />
                プロフィール
              </h2>

              <div className="space-y-6">
                <div>
                  <label
                    className={`block text-sm font-medium mb-3 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    ユーザー名
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        validateName(e.target.value);
                        setMessage("");
                      }}
                      disabled={!isEditing}
                      className={`flex-1 px-5 py-4 rounded-2xl border transition-all ${
                        isEditing
                          ? "bg-white/10 border-purple-500/50 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20"
                          : "bg-white/5 border-white/10"
                      } ${isDark ? "text-white" : "text-gray-900"}`}
                    />
                    {isEditing ? (
                      <button
                        onClick={handleUpdate}
                        className="p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-110 transition-all shadow-lg"
                      >
                        <Save className="w-6 h-6" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                      >
                        <Edit3 className="w-6 h-6 text-purple-400" />
                      </button>
                    )}
                  </div>
                  {nameError && (
                    <p className="text-red-400 text-sm mt-2">{nameError}</p>
                  )}
                </div>

                {message && (
                  <div
                    className={`flex items-center gap-3 p-4 rounded-2xl ${
                      message.includes("成功") || message.includes("更新")
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span>{message}</span>
                  </div>
                )}

                <div className="pt-6 space-y-4">
                  <Link
                    to="/my-orders"
                    className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-lg font-bold rounded-2xl hover:scale-105 transition-all shadow-lg"
                  >
                    <ShoppingBag className="w-6 h-6" />
                    注文履歴を見る
                  </Link>

                  <Link
                    to="/"
                    className={`w-full block text-center py-4 rounded-2xl border ${
                      isDark
                        ? "border-purple-500/50 text-purple-300 hover:bg-white/5"
                        : "border-purple-400 text-purple-600 hover:bg-purple-50"
                    } transition-all`}
                  >
                    ホームに戻る
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：自分の商品一覧 */}
          <div className="lg:col-span-2">
            <div
              className={`rounded-3xl p-8 backdrop-blur-xl border ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white/90 border-gray-200 shadow-2xl"
              }`}
            >
              <h2 className="text-4xl font-black mb-8 flex items-center gap-4">
                <Package className="w-10 h-10 text-purple-400" />
                自分が登録した商品
              </h2>

              {loadingProducts ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : productError ? (
                <p className="text-red-400 text-center py-10">{productError}</p>
              ) : myProducts.length === 0 ? (
                <div className="text-center py-20">
                  <Package className="w-24 h-24 mx-auto text-gray-500/30 mb-6" />
                  <p
                    className={`text-2xl ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    まだ商品を登録していません
                  </p>
                  <Link
                    to="/add"
                    className="inline-block mt-8 px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl hover:scale-110 transition-all shadow-2xl"
                  >
                    今すぐ商品を追加する
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6">
                  {myProducts.map((product) => (
                    <div
                      key={product._id}
                      className={`p-6 rounded-3xl backdrop-blur-xl border transition-all hover:scale-[1.02] ${
                        isDark
                          ? "bg-white/5 border-white/10 hover:border-purple-500/50"
                          : "bg-white/80 border-gray-200 hover:border-purple-400 shadow-lg"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-6 flex-1">
                          <img
                            src={product.imageUrl || "/placeholder.jpg"}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-2xl shadow-xl"
                          />
                          <div>
                            <h3
                              className={`text-2xl font-bold ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {product.name}
                            </h3>
                            <p className={`text-purple-400 font-medium`}>
                              {product.category}
                            </p>
                            <p
                              className={`text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mt-2`}
                            >
                              ¥{product.price.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              在庫数
                            </p>
                            <p
                              className={`text-3xl font-black ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {product.countInStock}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              min="0"
                              value={stockEdits[product._id] ?? ""}
                              onChange={(e) =>
                                setStockEdits({
                                  ...stockEdits,
                                  [product._id]: e.target.value,
                                })
                              }
                              placeholder={product.countInStock}
                              className={`w-24 px-4 py-3 rounded-2xl border text-center font-bold ${
                                isDark
                                  ? "bg-white/10 border-white/20 text-white placeholder-gray-500"
                                  : "bg-white border-gray-300 text-gray-900"
                              }`}
                            />
                            <button
                              onClick={() => handleSaveStock(product._id)}
                              disabled={updatingId === product._id}
                              className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-110 transition-all shadow-lg disabled:opacity-50"
                            >
                              <Save className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
