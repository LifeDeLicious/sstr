import express from "express";
import sessionController from "../controllers/sessionController.js";
import { requireAuth } from "../utils/authmiddleware.js";
const router = express.Router();

router.post("/create", sessionController.createSession);

router.get("/summaries", requireAuth, sessionController.getSessionSummaries);

router.get("/data/:sessionID", requireAuth, sessionController.getSessionData);

router.get("/list");

router.post(
  "/accessibility",
  requireAuth,
  sessionController.changeSessionAccessibility
);

router.post("/delete", requireAuth, sessionController.deleteSession);

export default router;
