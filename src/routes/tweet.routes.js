import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(upload.none(), createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(upload.none(), updateTweet).delete(deleteTweet);

export default router;
