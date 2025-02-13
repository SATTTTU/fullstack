import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {  createProductController, deleteProductController, productController, productPhotoController, singleProductController, updateProductController } from "../controller/productController.js";
import formidableMiddleware from "express-formidable"; // Corrected import
const router = express.Router();
router.use(formidableMiddleware());

// Routes
router.post("/createproduct", requireSignIn, isAdmin, createProductController); 
router.get("/getproduct",productController);
router.get("/getsingleproduct/:slug",singleProductController);
router.get("/getproductphoto/:pid",productPhotoController);
router.delete("/deleteproduct/:slug",requireSignIn,isAdmin,deleteProductController);
router.put("/updateproduct/:slug",requireSignIn,isAdmin,updateProductController);
export default router;
