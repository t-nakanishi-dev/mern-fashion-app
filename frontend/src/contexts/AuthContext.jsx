// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

const AuthContext = createContext(null);

// Custom hook to easily access the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  // Firebase user object (authentication info)
  const [firebaseUser, setFirebaseUser] = useState(null);
  // User info from MongoDB (custom user data)
  const [user, setUser] = useState(null);
  // Display name for the user; defaults to "ゲスト" if not logged in
  const [userName, setUserName] = useState("ゲスト");
  // Firebase ID token (used for API authentication)
  const [token, setToken] = useState(null);
  // Loading state for authentication and user info
  const [loading, setLoading] = useState(true);
  // Indicates whether the Firebase
  //  is new (not yet registered in MongoDB)
  const [isNewFirebaseUser, setIsNewFirebaseUser] = useState(false);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);

        try {
          // ★ Force token refresh to ensure updated custom claims
          const token = await firebaseUser.getIdToken(true);

          setToken(token);

          // Fetch user data from MongoDB API using the token
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUser(res.data);
          setUserName(res.data.name || "ゲスト");
          setIsNewFirebaseUser(false);
        } catch (error) {
          // If user is not found in MongoDB, treat as a new Firebase user
          if (error.response?.status === 404) {
            console.log("MongoDBに未登録のFirebaseユーザーです。");
            setUser(null);
            setUserName("ゲスト");
            setIsNewFirebaseUser(true);
          } else {
            // Handle other errors and fall back to guest state
            console.error("ユーザー情報取得エラー:", error);
            setUser(null);
            setUserName("ゲスト");
            setIsNewFirebaseUser(false);
          }
          setToken(null);
        }
      } else {
        // Reset all state when user is logged out
        setFirebaseUser(null);
        setUser(null);
        setUserName("ゲスト");
        setToken(null);
        setIsNewFirebaseUser(false);
      }

      // Mark loading as complete
      setLoading(false);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  // Values to be shared via context
  const value = {
    firebaseUser,
    user,
    setUser,
    userName,
    setUserName,
    token,
    loadingAuth: loading,
    isNewFirebaseUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Show a loading indicator while authentication is initializing */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
