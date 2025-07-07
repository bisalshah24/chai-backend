import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(404, "invalid video id");
  }
  const like = await Like.findOneAndDelete({ video: videoId });
  if (!like) {
    const newLike = await Like.create({
      video: new mongoose.Types.ObjectId(videoId),
      likedBy: new mongoose.Types.ObjectId(req.user._id),
    });
    res
      .status(200)
      .json(new ApiResponse(200, newLike, "toggled video like successfully"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, like, "toggled video like successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const like = await Like.findOneAndDelete({ comment: commentId });
  if (!like) {
    const newLike = await Like.create({
      comment: new mongoose.Types.ObjectId(commentId),
      likedBy: new mongoose.Types.ObjectId(req.user._id),
    });
    res
      .status(200)
      .json(new ApiResponse(200, newLike, "toggled video like successfully"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, like, "toggled video like successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const like = await Like.findOneAndDelete({ tweet: tweetId });
  if (!like) {
    const newLike = await Like.create({
      tweet: new mongoose.Types.ObjectId(tweetId),
      likedBy: new mongoose.Types.ObjectId(req.user._id),
    });
    res
      .status(200)
      .json(new ApiResponse(200, newLike, "toggled video like successfully"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, like, "toggled video like successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
