// src/utils/showToast.js
import { toast } from "react-toastify";

export const showSuccess = (message, options = {}) => {
  toast.success(message, {
    position: "bottom-center", // ← モバイルでも見やすい位置
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    ...options, // 必要に応じて上書き可能
  });
};

export const showError = (message, options = {}) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    ...options,
  });
};
