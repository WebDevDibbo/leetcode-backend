const Problem = require('../models/problem');
const SolutionVideo = require('../models/solutionVideo');

const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const generateUploadSignature = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.result._id;

    // verify the problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem Not Found" });
    }

    //1️⃣ generate timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);

    //2️⃣ Generate public IDs (organized folder structure)
    const videoPublicId = `leetcode_solutions/${problemId}/${userId}_${timestamp}`;
    const thumbnailPublicId = `${videoPublicId}_thumbnail`

    //3️⃣ Create upload params for video
    const videoParams = {
      timestamp,
      public_id: videoPublicId,
     
    };
    // console.log('Video Params for Signing:', videoParams);

    //4️⃣ Create upload params for thumbnail
    const thumbnailParams = {
      timestamp,
      public_id : thumbnailPublicId,
     
    };


    //5️⃣ Generate signatures (securely on server)
    const videoSignature = cloudinary.utils.api_sign_request(
      videoParams,
      process.env.CLOUDINARY_API_SECRET
    );

    const thumbnailSignature = cloudinary.utils.api_sign_request(
      thumbnailParams,
      process.env.CLOUDINARY_API_SECRET
    )

    //6️⃣ Prepare transformation URLs for different video qualities
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    // res.cloudinary.com part is not random — it’s the CDN (Content Delivery Network) domain Cloudinary uses to serve all your uploaded assets.
    const baseVideoUrl = `https://res.cloudinary.com/${cloudName}/video/upload`;


    const videoUrls = {
      original: `${baseVideoUrl}/${videoPublicId}.mp4`,
      low: `${baseVideoUrl}/q_40/${videoPublicId}.mp4`, // ~480p
      medium: `${baseVideoUrl}/q_60/${videoPublicId}.mp4`, // ~720p
      high: `${baseVideoUrl}/q_80/${videoPublicId}.mp4`, // ~1080p
      auto: `${baseVideoUrl}/q_auto/${videoPublicId}.mp4`, // auto optimize
    };

  
    //7️⃣ Respond with all signed info
    res.json({
      video : {
        signature : videoSignature,
        timestamp,
        public_id: videoPublicId,
        resource_type : "video",
        api_key: process.env.CLOUDINARY_API_KEY,
        upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
        urls : videoUrls
      },
      thumbnail : {
        signature : thumbnailSignature,
        timestamp,
        public_id : thumbnailPublicId,
        resource_type : "image",
        api_key : process.env.CLOUDINARY_API_KEY,
        upload_url : `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      }
    });
  } 
  catch (err) {
    console.log("error generating upload signature", err);
    res.status(500).json({ error: "Error generating upload signatures" });
  }
};



const saveVideoMetaData = async (req, res) => {
  try {
    const {
      problemId,
      videoPublicId,
      videoSecureUrl,
      duration,
      thumbnailPublicId,
      thumbnailSecureUrl,
    } = req.body;

    const userId = req.result._id;

    let videoResource, imageResource;

    try {
      [videoResource, imageResource] = await Promise.all([
        cloudinary.api.resource(videoPublicId, { resource_type: "video" }),
        cloudinary.api.resource(thumbnailPublicId, { resource_type: "image" }),
      ]);
    } catch (err) {
      console.error("Cloudinary verification failed:", err);
      return res
        .status(400)
        .json({ error: "Could not verify uploaded assets" });
    }

    if (!videoResource) {
      return res.status(400).json({ error: "Video not found on cloudinary" });
    }
    if (!imageResource) {
      return res
        .status(400)
        .json({ error: "Thumbnail not found on cloudinary" });
    }

    //check if video already exist for this problem and user
    const existingVideo = await SolutionVideo.findOne({
      problemId,
      userId,
      // cloudinaryPublicId
    });

    if (existingVideo) {
      return res.status(409).json({ error: "Video already exists" });
    }

    //create video solution record
    const videoSolution = await SolutionVideo.create({
      problemId,
      userId,
      videoPublicId,
      videoSecureUrl,
      duration: videoResource.duration || duration,
      thumbnailPublicId,
      thumbnailSecureUrl,
    });

    res.status(201).json({
      message: "Video Solution saved Successfully",
      videoSolution: {
        id: videoSolution._id,
        thumbnailUrl: videoSolution.thumbnailSecureUrl,
        duration: videoSolution.duration,
        uploadedAt: videoSolution.createdAt,
      },
    });
  } catch (err) {
    console.log("Error saving video metadata", err);
    res.status(500).json({ error: "Failed to save video metadata" });
  }
};



const deleteVideo = async (req, res) => {
  try {
    const { problemId } = req.params;

    const video = await SolutionVideo.findOneAndDelete({
      problemId: problemId,
    });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
      resource_type: "video",
      invalidate: true,
    });

    res.status(200).json({ message: "Video Deleted Successfully" });
  } catch (err) {
    console.log("Error deleting vide", err);
    res.status(500).json({ error: "Failed to delete Video" });
  }
};

module.exports = {generateUploadSignature, saveVideoMetaData, deleteVideo};