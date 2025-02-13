import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { categoryController, createCategory, deleteCategory, singlecategoryController, updateCategory } from "../controller/categoryController.js";
const router = express.Router();
router.post("/createcategory", requireSignIn, isAdmin, createCategory);
router.put("/updatecategory/:id", requireSignIn, isAdmin, updateCategory);
//get all category
router.get("/getcategory",categoryController);
//get single category
router.get("/singlecategory/:slug",singlecategoryController);
//delete
router.delete("/deletecategory/:id", requireSignIn, isAdmin, deleteCategory);
export default router;
