// src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { useAuth } from "../contexts/AuthContext";
import { Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);

  const { firebaseUser, loadingAuth } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      if (loadingAuth) return;

      try {
        setLoadingProducts(true);
        let headers = {};
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          headers = { Authorization: `Bearer ${token}` };
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`,
          {
            headers,
          }
        );
        setProducts(res.data);
      } catch (err) {
        console.error("商品取得エラー:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [firebaseUser, loadingAuth]);

  const categories = [
    { value: "all", label: "すべて" },
    { value: "tops", label: "トップス" },
    { value: "bottoms", label: "ボトムス" },
    { value: "accessory", label: "アクセサリー" },
    { value: "hat", label: "帽子" },
    { value: "bag", label: "バッグ" },
  ];

  const priceRanges = [
    { label: "すべての価格", value: "all" },
    { label: "〜¥5,000", value: "0-5000" },
    { label: "¥5,000〜¥10,000", value: "5000-10000" },
    { label: "¥10,000〜", value: "10000-999999" },
  ];

  const filteredProducts = products
    .filter((p) => (category === "all" ? true : p.category === category))
    .filter((p) => {
      if (priceRange === "all") return true;
      const [min, max] = priceRange.split("-").map(Number);
      return p.price >= min && (max ? p.price <= max : true);
    })
    .filter((p) =>
      keyword.trim() === ""
        ? true
        : p.name.toLowerCase().includes(keyword.toLowerCase()) ||
          p.description?.toLowerCase().includes(keyword.toLowerCase())
    );

  // ダーク／ライト切り替え用のクラス
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* タイトル + 検索バー */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            FashionStore
          </h1>

          {/* 検索ボックス（Apple風・ライトモード対応） */}
          <div className="mt-8 max-w-2xl mx-auto relative">
            <Search
              className={`absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="商品を検索..."
              className={`w-full pl-14 pr-6 py-4 rounded-2xl backdrop-blur-xl border transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50
                ${
                  isDark
                    ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400"
                    : "bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 shadow-lg"
                }`}
            />
          </div>
        </div>

        {/* フィルターエリア */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          {/* カテゴリフィルター */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 backdrop-blur-md border ${
                  category === cat.value
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                    : isDark
                    ? "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-purple-400/50"
                    : "bg-white/70 border-gray-300 text-gray-700 hover:bg-white hover:border-purple-400 shadow-md"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 価格フィルター */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className={`px-6 py-3 rounded-2xl backdrop-blur-md border transition-all focus:outline-none focus:ring-4 focus:ring-purple-500/50
              ${
                isDark
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-white/80 border-gray-300 text-gray-900 shadow-md"
              }`}
          >
            {priceRanges.map((range) => (
              <option
                key={range.value}
                value={range.value}
                className={
                  isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
                }
              >
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* ローディング or 商品一覧 */}
        {loadingProducts ? (
          <div className="flex justify-center items-center h-96">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p
              className={`text-2xl ${
                isDark ? "text-gray-500" : "text-gray-600"
              }`}
            >
              商品が見つかりませんでした
            </p>
            <p className={`mt-2 ${isDark ? "text-gray-600" : "text-gray-700"}`}>
              条件を変更して検索してください
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product._id} className="animate-fadeIn">
                {/* これを追加！ */}
                <ProductCard
                  product={product}
                  onClick={() => navigate(`/products/${product._id}`)} // ← これで遷移復活！
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
