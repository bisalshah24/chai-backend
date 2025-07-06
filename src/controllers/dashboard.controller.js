import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const totalVideos = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos",
      },
    },
    {
      $addFields: {
        totalVideos: { $size: "$videos" },
      },
    },
    {
      $project: {
        totalVideos: 1,
      },
    },
  ]);
  const totalSubscribers = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $addFields: {
        totalSubscribers: { $size: "$subscribers" },
      },
    },
    {
      $project: {
        totalSubscribers: 1,
      },
    },
  ]);
  const totalLikes = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "likedBy",
        as: "likes",
      },
    },
    {
      $addFields: {
        totalLikes: { $size: "$likes" },
      },
    },
    {
      $project: {
        totalLikes: 1,
      },
    },
  ]);
  const videos = await Video.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(req.user._id) },
    },
    {
      $project: {
        views: 1,
      },
    },
  ]);
  const totalVideoViews = videos.reduce(
    (total, views) => total + views.views,
    0
  );
  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos: totalVideos[0].totalVideos,
        totalSubscribers: totalSubscribers[0].totalSubscribers,
        totalLikes: totalLikes[0].totalLikes,
        totalVideoViews,
      },
      "Channel stats fetched successfully"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const videos = await Video.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(req.user._id) },
    },
  ]);
  res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
