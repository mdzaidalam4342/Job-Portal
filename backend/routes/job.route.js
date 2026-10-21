import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
    getAdminJobs,
    getAllJobs,
    getJobById,
    postJob,
    updateJob,
    deleteJob
} from "../controllers/job.controller.js";

const router = express.Router();

// Public routes: visitors can browse jobs
router.route("/get").get(getAllJobs);
router.route("/get/:id").get(getJobById);

// Protected routes: login required
router.route("/post").post(isAuthenticated, postJob);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/update/:id").put(isAuthenticated, updateJob);
router.route("/delete/:id").delete(isAuthenticated, deleteJob);

export default router;