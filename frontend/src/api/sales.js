// src/api/sales.js
import axios from "axios";
import { toast } from "react-toastify";

export const fetchDailySales = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/sales/daily`);
    return res.data;
  } catch (error) {
    console.error("日次売上データの取得に失敗しました:", error);

    // ユーザー向けエラーメッセージ
    toast.error(
      "売上データの取得に失敗しました。しばらくしてから再度お試しください。"
    );

    // 呼び出し元でさらに細かく処理できるように throw し直す
    throw error;
  }
};
