// src/components/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFavorite } from "../contexts/FavoriteContext";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import {
  Heart,
  ShoppingCart,
  ArrowLeft,
  Star,
  Package,
  User,
  Edit,
  Trash2,
  Send,
} from "lucide-react";
import { showSuccess } from "../utils/showToast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hasPurchased, setHasPurchased] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorite();
  const { user: currentUser, token } = useAuth();
  const { addToCart } = useCart();

  const favorite = product && isFavorite(product._id);
  const isAdmin = currentUser?.role === "admin";
  const isMine = currentUser && product?.createdBy?._id === currentUser._id;
  const canEditOrDelete = isAdmin || isMine;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
        setProduct(res.data);
        setReviews(res.data.reviews || []);
        setHasPurchased(true);
      } catch (err) {
        setError("商品が見つかりません");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    showSuccess("カートに追加しました！");
  };

  const handleDelete = async () => {
    if (!window.confirm("本当にこの商品を削除しますか？")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccess("商品を削除しました");
      navigate("/");
    } catch (err) {
      alert("削除に失敗しました");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/products/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess("レビューを投稿しました！");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
      setReviews(res.data.reviews || []);
      setComment("");
      setRating(5);
    } catch (err) {
      alert("投稿に失敗しました");
    }
  };

  const renderStars = (num) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= num) stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
      else stars.push(<Star key={i} className="w-5 h-5 text-gray-600" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-3xl text-gray-500">商品が見つかりません</p>
        <Link
          to="/"
          className="mt-6 inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:scale-105 transition"
        >
          ホームに戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* 戻るボタン */}
        <Link
          to="/"
          className="inline-flex items-center gap-3 text-gray-400 hover:text-white transition mb-8 group"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition" />
          <span className="text-lg">戻る</span>
        </Link>

        {/* メインコンテンツ */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* 画像エリア */}
          <div className="relative group">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/50 to-black/70 backdrop-blur-xl border border-purple-500/20 shadow-2xl">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full max-h-96 lg:max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* お気に入りボタン */}
            <button
              onClick={() => toggleFavorite(product._id)}
              className="absolute top-6 right-6 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/20 transition-all hover:scale-125 hover:bg-red-500/40"
            >
              <Heart
                className={`w-8 h-8 transition-all ${favorite ? "fill-red-500 text-red-500 scale-125" : "text-white"}`}
              />
            </button>
          </div>

          {/* 情報エリア */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {product.name}
              </h1>
              <p className="text-xl text-purple-300 mt-3 capitalize">{product.category}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                <span>在庫: {product.stock > 0 ? `${product.stock}点` : "売り切れ"}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>by {product.createdBy?.name || "Unknown"}</span>
              </div>
            </div>

            <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ¥{product.price.toLocaleString()}
            </div>

            {product.description && (
              <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-line">
                {product.description}
              </p>
            )}

            <button
              onClick={handleAddToCart}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl shadow-xl shadow-purple-600/50 hover:scale-105 hover:shadow-2xl hover:shadow-purple-600/70 transition-all duration-300 flex items-center justify-center gap-4"
            >
              <ShoppingCart className="w-7 h-7" />
              カートに追加
            </button>

            {canEditOrDelete && (
              <div className="flex gap-4">
                <Link
                  to={`/edit/${product._id}`}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl text-center font-bold hover:scale-105 transition flex items-center justify-center gap-3"
                >
                  <Edit className="w-6 h-6" />
                  編集する
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-bold hover:scale-105 transition flex items-center justify-center gap-3"
                >
                  <Trash2 className="w-6 h-6" />
                  削除する
                </button>
              </div>
            )}
          </div>
        </div>

        {/* レビューセクション */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-10 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            レビュー ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <p className="text-center text-gray-400 py-16 text-xl">
              まだレビューがありません。最初のレビューをどうぞ！
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">{renderStars(r.rating)}</div>
                    <p className="text-sm text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                  <p className="text-gray-400">{r.comment}</p>
                  <p className="text-sm text-purple-400 mt-3">
                    — {r.user?.name || "匿名ユーザー"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* レビュー投稿フォーム（購入済みかつ未投稿の場合） */}
          {hasPurchased && !reviews.some((r) => r.user?._id === currentUser?._id) && (
            <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 backdrop-blur-xl">
              <h3 className="text-2xl font-bold mb-6 text-white">レビューを書く</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div>
                  <label className="block text-lg mb-3 text-gray-500">評価</label>
                  <div className="flex gap-3">
                    {[5, 4, 3, 2, 1].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        className={`transition-all ${rating >= n ? "text-yellow-400 scale-125" : "text-gray-600"}`}
                      >
                        <Star className="w-10 h-10" fill={rating >= n ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="この商品はどうでしたか？"
                  rows="5"
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                />

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:scale-105 transition flex items-center justify-center gap-3"
                >
                  <Send className="w-6 h-6" />
                  レビューを投稿する
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}