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
      data: String,
      contentType: String
  }, 
    shipping: { type: Boolean, default: false } 
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
