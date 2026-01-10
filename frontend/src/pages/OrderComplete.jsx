import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify"; // ← toastが使える前提（なければalertで代用）

const OrderComplete = () => {
  const { clearCart, cartItems, totalPrice } = useCart();
  const { firebaseUser, loadingAuth } = useAuth();

  const [status, setStatus] = useState("processing"); // processing | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const hasAttempted = useRef(false);

  useEffect(() => {
    const saveOrder = async () => {
      if (loadingAuth || !firebaseUser || hasAttempted.current) return;

      if (cartItems.length === 0 || totalPrice <= 0) {
        setStatus("error");
        setErrorMessage(
          "カート情報が無効です。カートに戻って確認してください。"
        );
        return;
      }

      hasAttempted.current = true;

      try {
        const idToken = await firebaseUser.getIdToken();

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/orders/save-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              items: cartItems.map((item) => ({
                productId: item._id,
                quantity: item.quantity,
              })),
              totalAmount: totalPrice,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              errorData.error ||
              "注文の保存に失敗しました。在庫を確認してください。"
          );
        }

        clearCart();
        setStatus("success");
        toast.success("注文が正常に完了しました！", { position: "top-center" });
      } catch (err) {
        console.error("Error saving order:", err);
        setErrorMessage(
          err.message.includes("Insufficient stock")
            ? "在庫不足のため注文を処理できませんでした。カートを確認してください。"
            : err.message ||
                "注文処理中にエラーが発生しました。サポートにご連絡ください。"
        );
        setStatus("error");
        toast.error("注文処理に失敗しました", { position: "top-center" });
      }
    };

    saveOrder();
  }, [firebaseUser, loadingAuth, cartItems, totalPrice, clearCart]);

  // 処理中
  if (status === "processing") {
    return (
      <div className="p-10 text-center text-xl font-medium">
        注文を処理中です... 少々お待ちください。
      </div>
    );
  }

  // エラー時
  if (status === "error") {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          ⚠️ 注文処理に失敗しました
        </h2>
        <p className="mb-6 text-lg text-gray-800 dark:text-gray-200">
          {errorMessage}
        </p>
        <p className="mb-6">
          カート内容は保持されています。再度お試しください。
        </p>
        <Link
          to="/cart"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition"
        >
          カートに戻る
        </Link>
      </div>
    );
  }

  // 成功時
  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4 text-green-600">
        ✅ ご注文が完了しました！
      </h2>
      <p className="mb-6 text-lg">
        ご注文ありがとうございます。商品の発送まで今しばらくお待ちください。
      </p>
      <div className="space-y-4">
        <Link
          to="/my-orders"
          className="inline-block bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition"
        >
          注文履歴を確認する
        </Link>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
};

export default OrderComplete;
