import express from "express";
import {
  forgotPasswordController,
  loginController,
  registerController,
  testController,
} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();
//register using post method
router.post("/register", registerController);
//login using post method
router.post("/login", loginController);
router.post('/forgot-password',forgotPasswordController)
router.get("/test", requireSignIn, isAdmin, testController);
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/admin-auth", requireSignIn,isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
export default router;
