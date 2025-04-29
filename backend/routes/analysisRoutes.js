import express from "express";
const router = express.Router();

router.post("/login", (req, res) => {
  console.log("/login");
});

router.post("/register", (req, res) => {
  console.log("/register");
  res.send("get/register");
});

export default router;
