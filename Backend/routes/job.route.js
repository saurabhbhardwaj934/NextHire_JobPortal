import express from "express";
import authenticateToken from "../middleware/isAuthenticated.js";

import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controllers/job.controller.js";

const router = express.Router();

//  protected routes
router.route("/post").post(authenticateToken, postJob);
router.route("/getadminjobs").get(authenticateToken, getAdminJobs);

// PROBLEM tha yaha → auth hata diya
router.route("/get").get(getAllJobs);

// optional (id ke liye)
router.route("/get/:id").get(getJobById);

export default router;