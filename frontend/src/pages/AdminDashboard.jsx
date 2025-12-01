// src/pages/AdminDashboard.jsx 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import AdminOrderTable from "../components/Admin/AdminOrderTable";
import AdminFilters from "../components/Admin/AdminFilters";
import AdminProductList from "../components/Admin/AdminProductList";
import AdminUserTable from "../components/Admin/AdminUserTable";
import Spinner from "../components/common/Spinner";
import SalesChart from "../components/Admin/SalesChart";
import TopProductsChart from "../components/Admin/TopProductsChart";
import CategorySalesChart from "../components/Admin/CategorySalesChart";
import { ArrowLeft, Package, Users, ShoppingCart, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const { user, token, loadingAuth } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockEdits, setStockEdits] = useState({});
  const [filters, setFilters] = useState({
    status: "",
    username: "",
  });

  // ダークモードリアルタイム監視（AddProductと同じ）
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!loadingAuth) {
      if (!user || user.role !== "admin") {
        alert("管理者のみアクセス可能です。");
        navigate("/");
      }
    }
  }, [user, loadingAuth, navigate]);

  useEffect(() => {
    if (token && user?.role === "admin") {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [productsRes, ordersRes, usersRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/products/admin`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${import.meta.env.VITE_API_URL}/users`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);
          setProducts(productsRes.data);
          setOrders(ordersRes.data);
          setUsers(usersRes.data);
          setError(null);
        } catch (err) {
          console.error(err);
          setError("データの取得に失敗しました。");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [token, user]);

  const onRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      alert("権限を更新しました！");
    } catch (err) {
      console.error("権限更新エラー:", err.response?.data || err.message);
      alert("権限の更新に失敗しました。");
    }
  };

  const handleStockChange = (productId, value) => {
    setStockEdits((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleSaveStock = async (productId) => {
    const newCount = stockEdits[productId];
    if (isNaN(newCount) || Number(newCount) < 0) {
      alert("有効な在庫数を入力してください（0以上の数値）。");
      return;
    }
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/products/${productId}/stock`,
        { countInStock: Number(newCount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, countInStock: Number(newCount) } : p
        )
      );
      setStockEdits((prev) => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
      alert("在庫を更新しました！");
    } catch (err) {
      console.error("在庫更新エラー:", err.response?.data?.message || err.message);
      alert(`在庫の更新に失敗しました: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      alert("注文ステータスを更新しました！");
    } catch (err) {
      console.error("ステータス更新エラー:", err.response?.data || err.message);
      alert(`ステータス更新に失敗しました: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleFilterApply = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      });
      setOrders(res.data);
    } catch (err) {
      console.error("注文フィルタ取得エラー:", err);
      alert("注文の取得に失敗しました。");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("本当にこのユーザーを削除しますか？")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("削除エラー:", err);
      alert("削除に失敗しました。");
    }
  };

  if (loadingAuth || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error) return <div className="text-red-600 dark:text-red-400 text-center pt-20">{error}</div>;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            管理者ダッシュボード
          </h1>
          <p className={`text-xl ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            ショップ全体を完全掌握
          </p>
        </div>

        {/* メインカード */}
        <div className={`relative rounded-3xl overflow-hidden backdrop-blur-xl border transition-all duration-500 ${
          isDark ? "bg-white/5 border-white/10" : "bg-white/90 border-gray-200 shadow-2xl"
        }`}>
          {/* オーブ光 */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative p-8 lg:p-12 space-y-12">
            {/* 戻るボタン */}
            <Link
              to="/"
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${
                isDark
                  ? "border-purple-500/50 text-purple-300 hover:bg-white/5"
                  : "border-purple-400 text-purple-600 hover:bg-purple-50"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              ホームに戻る
            </Link>

            {/* 商品一覧（旧AdminProductListの代わり） */}
            <section>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                <Package className="w-9 h-9 text-purple-400" />
                商品管理
              </h2>
              <AdminProductList products={products} />
            </section>

            {/* 在庫管理テーブル（美しくリデザイン） */}
            <section>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                <Package className="w-9 h-9 text-pink-400" />
                在庫詳細管理
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-purple-500/20 backdrop-blur-sm">
                <table className="w-full text-sm">
                  <thead className={`${isDark ? "bg-gray-900/70" : "bg-gray-100"}`}>
                    <tr>
                      <th className="px-6 py-4 text-left font-medium text-purple-400">ID</th>
                      <th className="px-6 py-4 text-left font-medium text-purple-400">商品名</th>
                      <th className="px-6 py-4 text-left font-medium text-purple-400">カテゴリー</th>
                      <th className="px-6 py-4 text-left font-medium text-purple-400">価格</th>
                      <th className="px-6 py-4 text-left font-medium text-purple-400">在庫</th>
                      <th className="px-6 py-4 text-left font-medium text-purple-400">在庫操作</th>
                      <th className="px-6 py-4 text-left font-medium text-purple-400">作成者</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className={`border-t ${isDark ? "border-white/10 hover:bg-white/5" : "border-gray-200 hover:bg-purple-50/30"} transition-all`}>
                        <td className="px-6 py-4 font-mono text-xs">{product._id}</td>
                        <td className="px-6 py-4 font-medium">{product.name}</td>
                        <td className="px-6 py-4 text-purple-400 capitalize">{product.category}</td>
                        <td className="px-6 py-4">¥{product.price?.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.countInStock <= 5 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                            {product.countInStock}個
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={stockEdits[product._id] ?? product.countInStock}
                              onChange={(e) => handleStockChange(product._id, e.target.value)}
                              className={`w-20 px-3 py-2 rounded-lg border ${isDark ? "bg-white/10 border-white/30 text-white" : "bg-white border-gray-300"} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                            <button
                              onClick={() => handleSaveStock(product._id)}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all hover:scale-105 shadow-lg"
                            >
                              保存
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">{product.createdBy?.name || "不明"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 注文管理 */}
            <section>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                <ShoppingCart className="w-9 h-9 text-purple-400" />
                注文管理
              </h2>
              <div className={`rounded-2xl backdrop-blur-md border ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-gray-200 shadow-xl"} p-6`}>
                <AdminFilters filters={filters} setFilters={setFilters} onFilterApply={handleFilterApply} />
                <div className="mt-6">
                  <AdminOrderTable orders={orders} token={token} setOrders={setOrders} />
                </div>
              </div>
            </section>

            {/* ユーザー管理 */}
            <section>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                <Users className="w-9 h-9 text-pink-400" />
                ユーザー管理
              </h2>
              <div className={`rounded-2xl backdrop-blur-md border ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-gray-200 shadow-xl"} p-6`}>
                <AdminUserTable users={users} onRoleChange={onRoleChange} onDelete={handleDelete} />
              </div>
            </section>

            {/* グラフたち */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className={`rounded-2xl backdrop-blur-md border ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-gray-200 shadow-xl"} p-6`}>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <TrendingUp className="w-7 h-7 text-purple-400" />
                  月別売上推移
                </h3>
                <SalesChart token={token} />
              </div>
              <div className={`rounded-2xl backdrop-blur-md border ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-gray-200 shadow-xl"} p-6`}>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <TrendingUp className="w-7 h-7 text-pink-400" />
                  カテゴリー別売上
                </h3>
                <CategorySalesChart token={token} />
              </div>
            </section>

            <section>
              <div className={`rounded-2xl backdrop-blur-md border ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-gray-200 shadow-xl"} p-6`}>
                <h3 className="text-2xl font-bold mb-4">売上トップ商品</h3>
                <TopProductsChart token={token} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;