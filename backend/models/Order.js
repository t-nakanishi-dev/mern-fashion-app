// models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be at least 0"],
  },
  // ★★★ ここを追加 ★★★
  name: {
    type: String,
    // required: false でもOKですが、保存時に必ず入れることを推奨
  },
  imageUrl: {
    type: String,
  },
});

const orderSchema = new mongoose.Schema(
  {
    userUid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [
        (val) => val.length > 0,
        "At least one item must be included in the order",
      ],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price must be at least 0"],
    },
    status: {
      type: String,
      enum: ["未処理", "処理中", "発送済み", "キャンセル"],
      default: "未処理",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ userUid: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
