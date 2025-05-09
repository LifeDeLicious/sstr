import express from "express";
import sessionController from "../controllers/sessionController.js";
import { requireAuth } from "../utils/authmiddleware.js";
const router = express.Router();

// router.post("/login", (req, res) => {
//   console.log("/login");
// });

// router.post("/register", (req, res) => {
//   console.log("/register");
//   res.send("get/register");
// });

//router.post("/car", sessionController.postCar);

router.post("/create", sessionController.createSession);

router.get("/summaries", requireAuth, sessionController.getSessionSummaries);

router.get("/data/:sessionID", requireAuth, sessionController.getSessionData);

router.get("/list");

export default router;
