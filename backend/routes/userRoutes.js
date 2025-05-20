import express from "express";
import userController from "../controllers/userController.js";
import { requireAuth } from "../utils/authmiddleware.js";
const router = express.Router();

// router.post("/login", (req, res) => {
//   console.log("/login");
//   var id = 2;
//   var usern = "LifeDeLicious";
//   res
//     .status(303)
//     .send(JSON.stringify({ userID: id.toString(), userUsername: usern }));
// });

router.post("/register", userController.registerUser);

router.get("/user", userController.getUser);

router.post("/login", userController.loginUser);

//router.post("/loginclient", userController.loginUserClient);

router.get("/auth/status", requireAuth, userController.checkAuthStatus);

router.post("/logout", userController.logoutUser);

router.get("/admingetcars", requireAuth, userController.adminGetCars);

router.get("/admingettracks", requireAuth, userController.adminGetTracks);

router.get("/admingetusers", requireAuth, userController.adminGetUsers);

export default router;
