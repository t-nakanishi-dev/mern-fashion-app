// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProductList from "./components/ProductList";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProductDetail from "./components/ProductDetail";
import PrivateRoute from "./components/PrivateRoute";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import ConfirmOrder from "./pages/ConfirmOrder";
import OrderComplete from "./pages/OrderComplete";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProductList from "./components/Admin/AdminProductList";
import { LoadingProvider } from "./contexts/LoadingContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const navigate = useNavigate();

  // 🌙 ダークモード状態管理
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("dark-mode");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // 🌙 ダークモード反映
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("dark-mode", isDark.toString());
  }, [isDark]);

  // 🔐 認証情報
  const { user: mongoUser, loading: authLoading, userName } = useAuth();

  // 🚪 ログアウト
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("ログアウト成功");
      navigate("/login");
    } catch (error) {
      console.error("ログアウト失敗:", error);
    }
  };

  // ⭐ ここを削除：SignUp.jsx で既に登録処理をしているため不要
  // （Firebase新規ユーザー自動登録の useEffect を完全に削除）

  const displayName = userName || "ゲスト";
  const userRole = mongoUser?.role || "guest";

  return (
    <LoadingProvider>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/*"
          element={
            <Layout
              userName={displayName}
              userRole={userRole}
              handleLogout={handleLogout}
              isDark={isDark}
              setIsDark={setIsDark}
            >
              <Routes>
                <Route path="/" element={<ProductList />} />
                <Route
                  path="/add"
                  element={
                    <PrivateRoute>
                      <AddProduct />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <PrivateRoute>
                      <Cart />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/confirm"
                  element={
                    <PrivateRoute>
                      <ConfirmOrder />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/complete"
                  element={
                    <PrivateRoute>
                      <OrderComplete />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-orders"
                  element={
                    <PrivateRoute>
                      <MyOrders />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <PrivateRoute>
                      <AdminProductList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/edit/:id"
                  element={
                    <PrivateRoute>
                      <EditProduct />
                    </PrivateRoute>
                  }
                />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/products/:id" element={<ProductDetail />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </LoadingProvider>
  );
}

export default App;
