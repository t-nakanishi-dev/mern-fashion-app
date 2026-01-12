// index.js

require("dotenv").config(); // まず .env（共通）を読み込む

// 次に、環境に応じてオーバーライド用のファイルを読み込む
const env = process.env.NODE_ENV || "development"; // デフォルトは development

if (env === "production") {
  require("dotenv").config({ path: ".env.production", override: true });
} else {
  require("dotenv").config({ path: ".env.development", override: true });
}

// ✅ Import core modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// ✅ Import the initialized Firebase Admin SDK instance
const admin = require("./firebaseAdmin");

// ✅ Import route handlers
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/orderRoutes");
const salesRoutes = require("./routes/salesRoutes"); 

// ✅ Create the Express app instance
const app = express();

// ✅ Configure CORS middleware 
const allowedOrigins = ["http://localhost:5173"]; // ローカル開発用は固定

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.trim());
}

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// 📌 Global request logging middleware
app.use((req, res, next) => {
  console.log(`➡️ Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Enable JSON body parsing for incoming requests
app.use(express.json());

// ✅ Connect to MongoDB using Mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Register route handlers under the /api namespace
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/sales", salesRoutes); 

// ✅ Start the Express server on the specified port (default: 5000)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
