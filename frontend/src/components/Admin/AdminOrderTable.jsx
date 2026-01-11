// src/components/Admin/AdminOrderTable.jsx
import React from "react";
import axios from "axios";

const AdminOrderTable = ({ orders, token, setOrders }) => {
  // ステータス更新
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
      alert(
        `ステータス更新に失敗しました: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  return (
    <section className="text-gray-800 dark:text-white">
      <h2 className="text-2xl font-semibold mb-4">注文一覧</h2>
      {orders.length === 0 ? (
        <p>注文がありません。</p>
      ) : (
        <div className="overflow-x-auto">
          {/* 縦スクロール対応部分 */}
          <div
            className="
              max-h-[70vh] 
              overflow-y-auto 
              scrollbar-thin 
              scrollbar-thumb-purple-600 
              scrollbar-track-gray-800/50 
              scrollbar-thumb-rounded-full
            "
          >
            <table
              className="
                w-full 
                min-w-[1200px]          // 横幅を最低1200pxに強制（必要に応じて調整）
                divide-y divide-gray-700 
                border border-gray-300 
                dark:border-gray-600
              "
            >
              <thead className="bg-gray-200 dark:bg-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    注文ID
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    ユーザー名
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    合計金額
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    注文日時
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    商品詳細
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    ステータス
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm text-gray-900 dark:text-gray-200">
                      {order._id}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm text-gray-900 dark:text-gray-200">
                      {order.userUid?.name || "（不明なユーザー）"}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm text-gray-900 dark:text-gray-200">
                      ¥{order.totalPrice?.toLocaleString() || "0"}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm text-gray-900 dark:text-gray-200">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm text-gray-900 dark:text-gray-200 text-left">
                      {order.items?.map((item, index) => (
                        <div
                          key={item._id || `${order._id}-${index}`}
                          className="mb-1"
                        >
                          {/* スナップショット優先 + フォールバック */}
                          {item.name ||
                            item.productId?.name ||
                            "不明な商品"} × {item.quantity} (¥
                          {item.price?.toLocaleString() || "不明"})
                        </div>
                      ))}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 p-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="
                          w-full p-2 border rounded 
                          bg-white dark:bg-gray-700 
                          text-gray-900 dark:text-white 
                          border-gray-300 dark:border-gray-600
                          focus:outline-none focus:ring-2 focus:ring-purple-500
                        "
                      >
                        <option value="未処理">未処理</option>
                        <option value="処理中">処理中</option>
                        <option value="発送済み">発送済み</option>
                        <option value="キャンセル">キャンセル</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminOrderTable;
