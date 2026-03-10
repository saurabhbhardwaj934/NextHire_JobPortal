import express from "express";
import { register, login, logout, updateProfile } from "../controllers/user.controller.js";
import { singleUpload } from "../middleware/multer.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// ✅ REGISTER (file upload fix)
router.route("/register").post(singleUpload, register);

// ✅ LOGIN
router.route("/login").post(login);

// ✅ LOGOUT
router.route("/logout").get(logout);
router.route("/logout").post(logout);

// ✅ UPDATE PROFILE (optional file upload)
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

export default router;