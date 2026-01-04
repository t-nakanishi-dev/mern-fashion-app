// backend/routes/payment.js

const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;

  console.log("🛒 Received items for Stripe:", items); // ← デバッグ用に追加（重要！）

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "カートが空です" });
  }

  try {
    const lineItems = items.map((item) => {
      // name が存在しない場合のフォールバック
      const productName = item.name || item.product?.name || "不明な商品";

      if (!item.price || item.price <= 0) {
        throw new Error(`無効な価格: ${productName}`);
      }

      return {
        price_data: {
          currency: "jpy",
          product_data: {
            name: productName,
            // images: item.imageUrl ? [item.imageUrl] : [], // 任意で画像も追加可能
          },
          unit_amount: Math.round(item.price), // 念のため整数に
        },
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.FRONTEND_URL}/complete`, // ← /complete じゃなくて /order-complete に合わせる
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
