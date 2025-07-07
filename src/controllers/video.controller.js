import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title || title.trim() === "") {
    throw new ApiError(400, "title is required");
  }
  if (!description || description.trim() === "") {
    throw new ApiError(400, "description is required");
  }
  const videoLocalFilePath = req.files?.videoFile?.[0].path;
  if (!videoLocalFilePath) {
    throw new ApiError(400, "video is required");
  }
  const video = await uploadOnCloudinary(videoLocalFilePath);
  if (!video) {
    throw new ApiError(500, "video not uploaded on cloudinary");
  }
  const thumbnailLocalFilePath = req.files?.thumbnail?.[0].path;
  if (!thumbnailLocalFilePath) {
    throw new ApiError(400, "thumbnail is required");
  }
  const thumbnail = await uploadOnCloudinary(thumbnailLocalFilePath);
  if (!thumbnail) {
    throw new ApiError(500, "thumbnail not uploaded on cloudinary");
  }
  const newVideo = await Video.create({
    videoFile: video.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: video.duration,
    isPublished: true,
    owner: new mongoose.Types.ObjectId(req.user._id),
  });
  res
    .status(201)
    .json(new ApiResponse(201, newVideo, "Video created successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);
  res
    .status(200)
    .json(new ApiResponse(200, video, "Video retrieved successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const { title, description } = req.body;
  if (!title || title.trim() === "") {
    throw new ApiError(400, "title is required");
  }
  if (!description || description.trim() === "") {
    throw new ApiError(400, "description is required");
  }
  const thumbnailLocalFilePath = req.file?.path;
  if (!thumbnailLocalFilePath) {
    throw new ApiError(400, "thumbnail is required");
  }
  const thumbnail = await uploadOnCloudinary(thumbnailLocalFilePath);
  if (!thumbnail) {
    throw new ApiError(500, "thumbnail not uploaded on cloudinary");
  }
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      title,
      description,
      thumbnail: thumbnail.url,
    },
    { new: true }
  );
  res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const deletedVideo = await Video.findByIdAndDelete(videoId);
  if (!deletedVideo) {
    throw new ApiError(404, "Video not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, deletedVideo, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(
      new ApiResponse(200, video, "Video publish status toggled successfully")
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
