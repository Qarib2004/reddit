import multer from "multer";
import path from "path";

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg","image/png", "image/gif", "video/mp4", "video/mov", "video/avi"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("An unacceptable file format"), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

export default upload;
