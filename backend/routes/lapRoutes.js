import express from "express";
import lapController from "../controllers/lapController.js";
const router = express.Router();

router.post("/lap", lapController.postLap);

router.post("/register", (req, res) => {
  console.log("/register");
});

export default router;
