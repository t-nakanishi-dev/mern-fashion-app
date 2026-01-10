const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");
const Product = require("../models/Product"); // ← Productモデルをインポート（必要に応じてパス修正）

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;

  console.log("🛒 Received items for Stripe:", items);

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "カートが空です" });
  }

  try {
    // ★★★ 決済前に在庫チェックを実施 ★★★
    for (const item of items) {
      const product = await Product.findById(item._id || item.productId);

      if (!product) {
        return res.status(404).json({
          error: `商品が見つかりません: ${item.name || "不明な商品"} (ID: ${item._id || item.productId})`,
        });
      }

      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          error: `在庫不足: "${product.name}" (残り ${product.countInStock} 個)`,
        });
      }
    }

    // 在庫OKの場合のみStripeセッションを作成
    const lineItems = items.map((item) => {
      const productName = item.name || item.product?.name || "不明な商品";

      if (!item.price || item.price <= 0) {
        throw new Error(`無効な価格: ${productName}`);
      }

      return {
        price_data: {
          currency: "jpy",
          product_data: {
            name: productName,
            // images: item.imageUrl ? [item.imageUrl] : [], // 任意
          },
          unit_amount: Math.round(item.price),
        },
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.FRONTEND_URL}/complete`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });

    console.log("✅ Stripe Checkout Session Created:", session.id);

    res.json({ id: session.id });
  } catch (error) {
    console.error("❌ Stripe Checkout Session Error:", error);
    res.status(500).json({
      error: "決済セッションの作成に失敗しました",
      details: error.message,
    });
  }
});

module.exports = router;
