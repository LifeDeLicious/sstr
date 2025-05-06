import express from "express";
import sessionController from "../controllers/sessionController.js";
const router = express.Router();

// router.post("/login", (req, res) => {
//   console.log("/login");
// });

// router.post("/register", (req, res) => {
//   console.log("/register");
//   res.send("get/register");
// });

router.post("/car", sessionController.postCar);

router.post("/create", sessionController.createSession);

export default router;
