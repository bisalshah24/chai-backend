import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
router.route("/login").post(upload.none(), loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(upload.none(), refreshAccessToken);
router
  .route("/change-password")
  .post(verifyJWT, upload.none(), changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router
  .route("/update-account")
  .patch(verifyJWT, upload.none(), updateAccountDetails);
router
  .route("/avatar")
  .patch(upload.single("avatar"), verifyJWT, updateUserAvatar);
router
  .route("/cover-image")
  .patch(upload.single("coverImage"), verifyJWT, updateUserCoverImage);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
export default router;
