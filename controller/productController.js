import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";
import formidable from "formidable";

  export const createProductController = async (req, res) => {
    try {
        const form = formidable({ multiples: false });

        form.parse(req, async (err, fields, files) => {
            console.log("🟢 Request received in createProductController");

            if (err) {
                console.error("❌ Formidable Error:", err);
                return res.status(500).json({ success: false, message: "Formidable Error", error: err });
            }

            console.log("📦 Fields:", fields);
            console.log("🖼️ Files:", files);

            const { name, price, description, category, quantity, shipping } = fields;
            const { photo } = files;

            if (!name || !price || !description || !category || !quantity) {
                return res.status(400).json({ success: false, message: "All fields are required" });
            }

            const product = new productModel({
                ...fields,
                slug: slugify(name),
                shipping: shipping || false,
            });

            if (photo) {
                product.photo = {
                    data: fs.readFileSync(photo.filepath),
                    contentType: photo.mimetype || "image/png",
                };
            }

            await product.save();
            console.log("✅ Product saved successfully:", product);
            res.status(201).json({ success: true, message: "Product created successfully", product });
        });

    } catch (error) {
        console.error("❌ Error creating product:", error);
        res.status(500).json({ success: false, message: "Error creating product", error });
    }
};



export const productController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate("category")
            .select("-photo")
            .limit(10)
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, message: "All products", products, productCount: products.length });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching products", error });
    }
};

// ✅ Get Single Product
export const singleProductController = async (req, res) => {
    try {
        const product = await productModel
            .findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("category");

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Single Product", product });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching product", error });
    }
};

export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");

        // Check if the product exists and has a photo
        if (!product || !product.photo || !product.photo.data) {
            console.log("No product or photo found for ID:", req.params.pid);
            return res.status(404).json({ success: false, message: "Product photo not found" });
        }

        console.log("Product Found:", product);
        console.log("Content-Type:", product.photo.contentType);
        console.log("Photo Data Type:", typeof product.photo.data);
        console.log("Photo Data Length:", product.photo.data.length);

        // Ensure Content-Type is correct
        res.set("Content-Type", product.photo.contentType || "image/png");

        // Send raw image data
        return res.status(200).send(product.photo.data);
    } catch (error) {
        console.log("Error fetching image:", error);
        res.status(500).json({ success: false, message: "Error while getting photo", error });
    }
};
export const deleteProductController = async (req, res) => {
    try {
        const product = await productModel.findOneAndDelete({ slug: req.params.slug });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product deleted successfully", product });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error deleting product", error });
    }
};
export const updateProductController = async (req, res) => {
    try {
        const form = formidable({ multiples: false });

        form.parse(req, async (err, fields, files) => {
            console.log("🟢 Request received in updateProductController");

            if (err) {
                console.error("❌ Formidable Error:", err);
                return res.status(500).json({ success: false, message: "Formidable Error", error: err });
            }

            console.log("📦 Fields:", fields);
            console.log("🖼️ Files:", files);

            const { name, price, description, category, quantity, shipping } = fields;
            const { photo } = files;

            if (!name || !price || !description || !category || !quantity) {
                return res.status(400).json({ success: false, message: "All fields are required" });
            }

            const product = await productModel.findOne({ slug: req.params.slug });

            if (!product) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }

            product.name = name;
            product.slug = slugify(name);
            product.price = price;
            product.description = description;
            product.category = category;
            product.quantity = quantity;
            product.shipping = shipping || false;

            if (photo) {
                product.photo = {
                    data: fs.readFileSync(photo.filepath),
                    contentType: photo.mimetype || "image/png",
                };
            }

            await product.save();
            console.log("✅ Product updated successfully:", product);
            res.status(200).json({ success: true, message: "Product updated successfully", product });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error updating product", error });
        
    }
};

  