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

router.get("/usersettings", requireAuth, userController.getUserProfile);

router.post(
  "/user/changeusername",
  requireAuth,
  userController.userChangeUsername
);

router.post(
  "/user/deleteprofile",
  requireAuth,
  userController.userDeleteProfile
);

router.post("/login", userController.loginUser);

//router.post("/loginclient", userController.loginUserClient);

router.get("/auth/status", requireAuth, userController.checkAuthStatus);

router.post("/logout", userController.logoutUser);

router.get("/admin/getcars", requireAuth, userController.adminGetCars);

router.get("/admin/gettracks", requireAuth, userController.adminGetTracks);

router.get("/admin/getusers", requireAuth, userController.adminGetUsers);

router.post("/admin/deleteuser", requireAuth, userController.adminDeleteUser);

router.post("/admin/updatetrack", requireAuth, userController.adminUpdateTrack);

router.post("/admin/updatecar", requireAuth, userController.adminUpdateCar);

export default router;
