// src/pages/Favorites.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useFavorite } from "../contexts/FavoriteContext";

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorite();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!favorites) return;
    if (favorites.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => {
        const filtered = res.data.filter((p) => favorites.includes(p._id));
        setProducts(filtered);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [favorites]);

  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            お気に入り一覧
          </h1>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:scale-105 transition shadow-lg"
          >
            ホームに戻る
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl text-gray-500 mb-6">
              お気に入りがまだありません
            </p>
            <Link
              to="/"
              className="inline-block px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-2xl hover:scale-110 transition shadow-2xl"
            >
              今すぐ商品を探す
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => handleCardClick(product._id)}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
