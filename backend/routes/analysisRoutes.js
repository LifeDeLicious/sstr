import express from "express";
import analysisController from "../controllers/analysisController.js";
import { requireAuth } from "../utils/authmiddleware.js";
const router = express.Router();

router.post("/", requireAuth, analysisController.createAnalysis);

router.get("/:analysisID", requireAuth, analysisController.getAnalysisData);

router.get("/", requireAuth, analysisController.getAnalysisList);

router.get("/graphs/:analysisID", requireAuth, analysisController.getGraphData);

export default router;
