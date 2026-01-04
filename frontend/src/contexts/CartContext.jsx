// src/contexts/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [currentUserUid, setCurrentUserUid] = useState(null);

  // Firebase Authの状態を監視
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const uid = user ? user.uid : null;
      setCurrentUserUid(uid);

      // ユーザー変更時にローカルストレージから適切なカートを読み込む
      if (uid) {
        const saved = localStorage.getItem(`cart_${uid}`);
        setCartItems(saved ? JSON.parse(saved) : []);
      } else {
        // ログアウト時はカートを空に（ゲスト用は作らない場合）
        setCartItems([]);
        localStorage.removeItem("cart_guest"); // 必要ならゲスト用も
      }
    });

    return () => unsubscribe();
  }, []);

  // カート変更時にユーザーごとのキーで保存
  useEffect(() => {
    if (currentUserUid) {
      localStorage.setItem(`cart_${currentUserUid}`, JSON.stringify(cartItems));
    }
  }, [cartItems, currentUserUid]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const addToCart = (product) => {
    if (!currentUserUid) {
      alert("ログインしてください");
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === productId);
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return prev.map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter((item) => item._id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (currentUserUid) {
      localStorage.removeItem(`cart_${currentUserUid}`);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};
