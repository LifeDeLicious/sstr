import express from "express";
import lapController from "../controllers/lapController.js";
import { requireAuth } from "../utils/authmiddleware.js";
const router = express.Router();

router.post("/lap", lapController.postLap);

router.get("/batch", lapController.getTelemetryFiles);

router.post("/register", (req, res) => {
  console.log("/register");
});

export default router;
