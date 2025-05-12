import express from "express";
import analysisController from "../controllers/analysisController.js";
const router = express.Router();

router.post("/", analysisController.createAnalysis);

export default router;
