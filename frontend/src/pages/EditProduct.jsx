// src/pages/EditProduct.jsx 
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Upload,
  Package,
  Image,
  Tag,
  DollarSign,
  Type,
  CheckCircle,
} from "lucide-react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user: currentUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    imageUrl: "",
    price: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then((res) => {
        setForm(res.data);
        if (
          res.data.createdBy._id !== currentUser._id &&
          currentUser.role !== "admin"
        ) {
          toast.error("この商品は編集できません");
          navigate("/");
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setError("商品情報の取得に失敗しました");
        setLoading(false);
      });
  }, [id, currentUser, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mern-fashion-app-unsigned");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dagqtxj06/image/upload",
        formData
      );
      setForm((prev) => ({ ...prev, imageUrl: res.data.secure_url }));
      toast.success("画像を変更しました！");
    } catch (err) {
      toast.error("画像のアップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/products/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("商品を更新しました！", {
        icon: <CheckCircle className="w-6 h-6" />,
      });
      navigate(currentUser.role === "admin" ? "/admin/products" : "/");
    } catch (err) {
      toast.error("更新に失敗しました");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (error) return <p className="text-red-500 text-center pt-20">{error}</p>;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            商品を編集
          </h1>
        </div>

        <div
          className={`relative rounded-3xl overflow-hidden backdrop-blur-xl border transition-all duration-500 ${
            isDark
              ? "bg-white/5 border-white/10"
              : "bg-white/90 border-gray-200 shadow-2xl"
          }`}
        >
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative p-8 lg:p-12">
            <Link
              to={currentUser.role === "admin" ? "/admin/products" : "/"}
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all mb-8 ${
                isDark
                  ? "border-purple-500/50 text-purple-300 hover:bg-white/5"
                  : "border-purple-400 text-purple-600 hover:bg-purple-50"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              {currentUser.role === "admin" ? "管理画面に戻る" : "ホームに戻る"}
            </Link>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 商品名 */}
              <div className="relative">
                <Type className="absolute left-6 top-6 w-6 h-6 text-purple-400 z-10" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={`w-full pl-16 pr-6 py-6 text-xl font-medium rounded-2xl border transition-all focus:ring-4 focus:ring-purple-500/20 ${
                    isDark
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-500 focus:border-purple-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 shadow-lg"
                  }`}
                  placeholder="商品名を編集"
                />
              </div>

              {/* カテゴリ */}
              <div className="relative group">
                <Tag className="absolute left-6 top-6 w-6 h-6 text-purple-400 z-10" />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className={`w-full pl-16 pr-14 py-6 text-xl font-semibold rounded-2xl border-2 appearance-none transition-all duration-500 focus:ring-4 focus:ring-purple-500/40 relative overflow-hidden cursor-pointer ${
                    isDark
                      ? "bg-gray-700/75 border-purple-500 text-white hover:border-purple-400 shadow-2xl shadow-purple-500/50 backdrop-blur-sm"
                      : "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 text-purple-900 hover:border-purple-500 shadow-xl"
                  }`}
                  style={{ backgroundImage: "none" }}
                >
                  <option value="" disabled>
                    カテゴリを選択
                  </option>
                  <option value="tops">トップス</option>
                  <option value="bottoms">ボトムス</option>
                  <option value="accessory">アクセサリー</option>
                  <option value="hat">帽子</option>
                  <option value="bag">バッグ</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className={`w-8 h-8 drop-shadow-lg ${
                      isDark ? "text-pink-400" : "text-purple-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* 説明 */}
              <div className="relative">
                <Package className="absolute left-6 top-6 w-6 h-6 text-purple-400 z-10" />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full pl-16 pr-6 py-6 text-lg rounded-2xl border resize-none transition-all focus:ring-4 focus:ring-purple-500/20 ${
                    isDark
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-500 focus:border-purple-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 shadow-lg"
                  }`}
                  placeholder="商品の説明を編集..."
                />
              </div>

              {/* 画像アップロード */}
              <div className="relative">
                <Image className="absolute left-6 top-6 w-6 h-6 text-purple-400 z-10" />
                <label
                  className={`block w-full pl-16 pr-6 py-6 text-xl rounded-2xl border border-dashed cursor-pointer transition-all ${
                    isDark
                      ? "border-white/30 hover:border-purple-400 bg-white/5 hover:bg-white/10"
                      : "border-gray-300 hover:border-purple-500 bg-gray-50 hover:bg-purple-50"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <div className="text-center">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-purple-400 font-medium">
                          アップロード中...
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                        <p
                          className={isDark ? "text-gray-300" : "text-gray-700"}
                        >
                          新しい画像を選択
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {form.imageUrl && (
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={form.imageUrl}
                    alt="現在の画像"
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              {/* 価格 */}
              <div className="relative">
                <DollarSign className="absolute left-6 top-6 w-6 h-6 text-purple-400 z-10" />
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className={`w-full pl-16 pr-6 py-6 text-xl font-bold rounded-2xl border transition-all focus:ring-4 focus:ring-purple-500/20 ${
                    isDark
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-500 focus:border-purple-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 shadow-lg"
                  }`}
                  placeholder="価格を編集"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-8 text-3xl font-black text-white rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {uploading ? "アップロード中..." : "商品を更新する"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
