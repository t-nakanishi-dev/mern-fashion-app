// src/components/ProductCard.jsx
import React from "react";
import { useFavorite } from "../contexts/FavoriteContext"; // ← これを追加！
import { useCart } from "../contexts/CartContext";
import { Heart, ShoppingCart } from "lucide-react";

const ProductCard = ({ product, onClick, isAdmin = false }) => {
  const { toggleFavorite, isFavorite } = useFavorite(); // ← これでエラー解消！
  const { addToCart } = useCart();
  const favorite = isFavorite(product._id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(product._id);
  };

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900/60 to-black/70 backdrop-blur-xl border border-purple-500/20 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-purple-500/30 hover:border-purple-400/50 cursor-pointer"
    >
      {/* ホバー光エフェクト */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-transparent to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* お気に入りボタン - 管理者画面では非表示 */}
      {!isAdmin && (
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 transition-all hover:scale-110 hover:bg-red-500/40"
          aria-label="お気に入り"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              favorite ? "fill-red-500 text-red-500 scale-110" : "text-gray-400"
            }`}
          />
        </button>
      )}

      {/* 画像コンテナ */}
      <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-900/50">
        <img
          src={product.imageUrl || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      <div className="p-5 space-y-3">
        <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-purple-300 font-medium">
          {product.category}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>by {product.createdBy?.name || "Unknown"}</span>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full">
              残り {product.stock}点
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2 py-1 bg-red-500/30 text-red-400 rounded-full">
              売り切れ
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ¥{product.price.toLocaleString()}
          </p>

          {/* カートボタン */}
          <button
            onClick={handleAddToCart}
            className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-500 hover:scale-110"
            aria-label="カートに追加"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
