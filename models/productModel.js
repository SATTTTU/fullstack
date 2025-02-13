import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    quantity: { type: Number, required: true },
    photo: {
      data: Buffer,
      contentType: {
          type: String,
          required: true // Ensure contentType is always present
      }
  }, // Corrected photo field structure
    shipping: { type: Boolean, default: false } // Used `default: false` instead of `required: false`
  },
  { timestamps: true } // ✅ Correct placement of timestamps
);

export default mongoose.model("Product", productSchema);
