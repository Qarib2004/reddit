import multer from "multer";

const storage1 = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif","image/webp", "application/pdf", "video/mp4", "video/mov", "video/avi"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload1 = multer({
  storage1,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

export default upload1;
