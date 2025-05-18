import express from "express";
import analysisController from "../controllers/analysisController.js";
import { requireAuth } from "../utils/authmiddleware.js";
const router = express.Router();

router.post("/", requireAuth, analysisController.createAnalysis);

router.get("/:analysisID", requireAuth, analysisController.getAnalysisData);

router.get("/", requireAuth, analysisController.getAnalysisList);

router.get("/graphs/:analysisID", requireAuth, analysisController.getGraphData);

router.get(
  "/bestlaps/:analysisID",
  requireAuth,
  analysisController.getUsersBestLaps
);

router.post("/lap", requireAuth, analysisController.addAnalysisLap);

router.post("/pastelap", requireAuth, analysisController.pasteAnalysisLap);

router.delete(
  "/lap/:analysisID/:lapID",
  requireAuth,
  analysisController.removeAnalysisLap
);

router.post(
  "/accessibility",
  requireAuth,
  analysisController.changeAnalysisAccessibility
);

router.post("/color", requireAuth, analysisController.changeAnalysisLapColor);

router.post(
  "/lapvisibility",
  requireAuth,
  analysisController.changeAnalysisLapVisibility
);

export default router;
