const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_secret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Findr_uploads",
    allowedFormats: ["png", "jpeg", "jpg", "avif", "webp"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
