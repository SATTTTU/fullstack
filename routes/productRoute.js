import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createProductController, deleteProductController, productController, productPhotoController, singleProductController, updateProductController, upload } from "../controller/productController.js";
const router = express.Router();

// Routes
router.post("/createproduct", upload.single("photo"), createProductController);
router.get("/getproduct",productController);
router.get("/getsingleproduct/:slug",singleProductController);
router.get("/getproductphoto/:pid",productPhotoController);
router.delete("/deleteproduct/:slug",requireSignIn,isAdmin,deleteProductController);
router.put("/updateproduct/:slug",requireSignIn,isAdmin,updateProductController);
export default router;
