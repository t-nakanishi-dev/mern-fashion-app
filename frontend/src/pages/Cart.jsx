// src/pages/Cart.jsx
import React from "react";
import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ダーク／ライト判定
  const isDark = document.documentElement.classList.contains("dark");

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <ShoppingBag className="w-32 h-32 mx-auto text-purple-500/30" />
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mt-8">
              カートは空です
            </h1>
            <p
              className={`mt-4 text-xl ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              欲しい商品をカートに入れてみましょう！
            </p>
          </div>
          <Link
            to="/"
            className="inline-block px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl hover:scale-110 transition-all duration-300 shadow-2xl shadow-purple-500/50"
          >
            商品を探しに行く
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* タイトル */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ショッピングカート
          </h1>
          <p
            className={`mt-4 text-xl ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {cartItems.length}点の商品
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* カート商品リスト */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className={`relative overflow-hidden rounded-3xl backdrop-blur-xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                  isDark
                    ? "bg-white/5 border-white/10 hover:border-purple-500/50 hover:shadow-purple-500/20"
                    : "bg-white/80 border-gray-200 hover:border-purple-400 shadow-lg"
                }`}
              >
                {/* ホバー光エフェクト */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="p-6 flex gap-6">
                  {/* 商品画像 */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.imageUrl || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-2xl shadow-xl"
                    />
                  </div>

                  {/* 商品情報 */}
                  <div className="flex-1">
                    <h3
                      className={`text-2xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.name}
                    </h3>
                    <p
                      className={`mt-1 text-sm ${
                        isDark ? "text-purple-300" : "text-purple-600"
                      } font-medium`}
                    >
                      {item.category}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p
                          className={`text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}
                        >
                          ¥{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          ¥{item.price.toLocaleString()} × {item.quantity}個
                        </p>
                      </div>

                      {/* 数量コントロール */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="p-3 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all hover:scale-110"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span
                          className={`text-2xl font-bold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="p-3 rounded-full bg-green-500/20 hover:bg-green-500/40 text-green-400 transition-all hover:scale-110"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 合計＆購入ボタン */}
          <div className="lg:col-span-1">
            <div
              className={`sticky top-24 rounded-3xl p-8 backdrop-blur-xl border transition-all ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white/90 border-gray-200 shadow-2xl"
              }`}
            >
              <h2
                className={`text-3xl font-black ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-6`}
              >
                注文合計
              </h2>

              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    小計
                  </span>
                  <span
                    className={`font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ¥{total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    送料
                  </span>
                  <span className="text-green-400 font-bold">無料</span>
                </div>
                <div className="border-t border-purple-500/30 pt-4">
                  <div className="flex justify-between">
                    <span
                      className={`text-2xl font-black ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      合計
                    </span>
                    <span className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ¥{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Link
                  to="/confirm"
                  className="w-full flex items-center justify-center gap-3 px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/50"
                >
                  購入手続きへ進む
                  <ArrowRight className="w-6 h-6" />
                </Link>

                <button
                  onClick={clearCart}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-2xl transition-all duration-300"
                >
                  <Trash2 className="w-5 h-5" />
                  カートを空にする
                </button>
              </div>

              <div className="mt-8 text-center">
                <Link
                  to="/"
                  className={`inline-flex items-center gap-2 ${
                    isDark
                      ? "text-purple-300 hover:text-purple-400"
                      : "text-purple-600 hover:text-purple-700"
                  } font-medium transition`}
                >
                  買い物を続ける
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
