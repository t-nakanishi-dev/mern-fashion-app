// src/pages/SignUp.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "名前は必須です。";
    if (!email) newErrors.email = "メールアドレスは必須です。";
    else if (!validateEmail(email))
      newErrors.email = "メールアドレスの形式が正しくありません。";
    if (!password) newErrors.password = "パスワードは必須です。";
    else if (password.length < 6)
      newErrors.password = "パスワードは6文字以上で入力してください。";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });

      const user = userCredential.user;
      const token = await user.getIdToken();

      await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          uid: user.uid,
          name: user.displayName || "No name",
          email: user.email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("登録に成功しました！");
      navigate("/");
    } catch (err) {
      console.error("登録エラー:", err);
      if (err.response?.status === 409)
        toast.error(err.response.data.message || "既に登録されています。");
      else if (err.code === "auth/email-already-in-use")
        toast.error("このメールアドレスは既に使用されています。");
      else toast.error("登録に失敗しました。もう一度お試しください。");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-800 p-4">
      <div className="w-full max-w-md p-6 border rounded shadow bg-white dark:bg-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          新規登録
        </h2>

        <form
          onSubmit={handleSignUp}
          className="flex flex-col gap-4"
          noValidate
        >
          <input
            type="text"
            placeholder="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`p-2 border rounded w-full
              bg-white text-gray-800 placeholder-gray-400
              dark:bg-gray-700 dark:text-white dark:placeholder-gray-300
              ${
                errors.name
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}

          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`p-2 border rounded w-full
              bg-white text-gray-800 placeholder-gray-400
              dark:bg-gray-700 dark:text-white dark:placeholder-gray-300
              ${
                errors.email
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}

          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`p-2 border rounded w-full
              bg-white text-gray-800 placeholder-gray-400
              dark:bg-gray-700 dark:text-white dark:placeholder-gray-300
              ${
                errors.password
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}

          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-500"
          >
            登録する
          </button>
        </form>

        {/* ログインリンク */}
        <p className="text-sm mt-4 text-center text-gray-600 dark:text-gray-300">
          すでにアカウントをお持ちですか？{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            ログインはこちら
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
