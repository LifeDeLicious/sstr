import express from "express";
import analysisController from "../controllers/analysisController.js";
import { requireAuth } from "../utils/authmiddleware.js";
const router = express.Router();

router.post("/", requireAuth, analysisController.createAnalysis);

export default router;
