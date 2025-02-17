import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";
import { fileURLToPath } from 'url';
import multer from "multer";
import path from "path";
import express from "express";
import Categorymodel from "../models/Categorymodel.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const upload = multer({ storage });

const app = express();
app.use("/uploads", express.static(uploadPath));

export const createProductController = async (req, res) => {
    try {
        console.log("🟢 Request received in createProductController", req.body, req.file);

        const { name, price, description, category, quantity, shipping } = req.body;

        if (!name || !price || !description || !category || !quantity) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const product = new productModel({
            name,
            price,
            description,
            category,
            quantity,
            slug: slugify(name),
            shipping: shipping === "true",
        });

        if (req.file) {
            product.photo = {
                data: `/uploads/${req.file.filename}`,
                contentType: req.file.mimetype,
            };
        } else {
            console.log("❌ No image uploaded");
        }

        await product.save();
        console.log("✅ Product saved successfully:", product);

        res.status(201).json({ success: true, message: "Product created successfully", product });
    } catch (error) {
        console.error("❌ Error creating product:", error);
        res.status(500).json({ success: false, message: "Error creating product", error });
    }
};

export const productPhotoController = async (req, res) => {
    try {
        const { pid } = req.params;
        
        if (!pid || pid.length !== 24) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid product ID" 
            });
        }
        
        const product = await productModel.findById(pid).select("photo");
        
        if (!product?.photo?.data) {
            console.log("❌ No product or photo found for ID:", pid);
            return res.status(404).json({ 
                success: false, 
                message: "Product photo not found" 
            });
        }

        // Get the absolute file path
        const photoPath = path.join(__dirname, "..", product.photo.data);
        
        // Set content type
        res.set("Content-Type", product.photo.contentType);
        
        // Send the file
        return res.sendFile(photoPath);

    } catch (error) {
        console.error("❌ Error fetching image:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error while getting photo", 
            error: error.message 
        });
    }
};


export const productController = async (req, res) => {
    try {
        const { category } = req.query;
        let filter = {};

        if (category) {
            const categoryData = await Categorymodel.findOne({ slug: category });

            if (!categoryData) {
                return res.status(404).json({ success: false, message: "Category not found" });
            }

            filter.category = categoryData._id; // Use ObjectId in filter
        }

        const products = await productModel
            .find(filter)
            .populate("category")
            .select("-photo")
            .limit(10)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Fetched products successfully",
            products,
            productCount: products.length
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error
        });
    }
};



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

export const deleteProductController = async (req, res) => {
    try {
        const product = await productModel.findOneAndDelete({ slug: req.params.slug });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Delete the associated image file if it exists
        if (product.photo?.data) {
            const photoPath = path.join(__dirname, "..", product.photo.data);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }

        res.status(200).json({ success: true, message: "Product deleted successfully", product });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error deleting product", error });
    }
};

export const updateProductController = async (req, res) => {
    try {
        console.log("🟢 Request received in updateProductController");

        const { name, price, description, category, quantity, shipping } = req.body;
        const productSlug = req.params.slug;

        console.log("🔍 Looking for product with slug:", productSlug);

        let product = await productModel.findOne({ slug: productSlug });
        if (!product) {
            console.log("❌ Product not found!");
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Delete old image if new one is uploaded
        if (req.file && product.photo?.data) {
            const oldPhotoPath = path.join(__dirname, "..", "uploads", path.basename(product.photo.data));
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
                console.log("🗑 Old image deleted:", oldPhotoPath);
            }
        }

        let shippingBoolean = shipping === "Yes" ? true : shipping === "No" ? false : product.shipping;

        product.name = name || product.name;
        if (name) product.slug = slugify(name);
        product.price = price || product.price;
        product.description = description || product.description;
        product.category = category || product.category;
        product.quantity = quantity || product.quantity;
        product.shipping = shippingBoolean;

        if (req.file) {
            product.photo = {
                data: `/uploads/${req.file.filename}`,
                contentType: req.file.mimetype,
            };
            console.log("🆕 New image path:", product.photo.data);
        }

        await product.save();
        console.log("✅ Product updated successfully:", product);
        res.status(200).json({ success: true, message: "Product updated successfully", product });

    } catch (error) {
        console.error("❌ Error updating product:", error);
        res.status(500).json({ success: false, message: "Error updating product", error });
    }
};