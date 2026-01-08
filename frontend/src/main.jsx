// src/main.jsx
// API for creating a root in React 18+
import { createRoot } from "react-dom/client";

// Provides routing functionality using React Router
import { BrowserRouter } from "react-router-dom";

// Context for managing favorite items
import { FavoriteProvider } from "./contexts/FavoriteContext";

// Context for managing the shopping cart
import { CartProvider } from "./contexts/CartContext";

// Context for managing authentication state
import { AuthProvider } from "./contexts/AuthContext";

// Toast notification component (used to show feedback to users)
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

// Global styles and the main app component
import "./index.css";
import App from "./App.jsx";

// 📌 Render the application into the root DOM element
// ✅ StrictMode を削除（本番環境では不要。二重実行・二重toastの原因になるため）
createRoot(document.getElementById("root")).render(
  <FavoriteProvider>
    {/* 🧭 Handles client-side routing and navigation */}
    <BrowserRouter>
      {/* 🛒 Manages cart state (items, total amount, etc.) */}
      <CartProvider>
        {/* 🔐 Manages authentication state (logged-in user info, etc.) */}
        <AuthProvider>
          {/* 🧩 The main application component */}
          <App />

          {/* 💬 Displays toast notifications (success, error messages, etc.) */}
          <ToastContainer
            position="top-center"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            className="mt-20" // ヘッダーと被らないように少し下げる
          />
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  </FavoriteProvider>
);
