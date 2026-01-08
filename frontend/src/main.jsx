// src/main.jsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { FavoriteProvider } from "./contexts/FavoriteContext";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";

// ✅ StrictMode なし（二重実行防止）
createRoot(document.getElementById("root")).render(
  <FavoriteProvider>
    <BrowserRouter>
      <CartProvider>
        <AuthProvider>
          <App />

          {/* ✅ ToastContainer はここに1つだけ */}
          <ToastContainer
            position="top-center"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            className="mt-20"
          />
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  </FavoriteProvider>
);
