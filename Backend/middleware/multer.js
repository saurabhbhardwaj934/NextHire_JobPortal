import multer from "multer";

// memory storage (Cloudinary ke liye best)
const storage = multer.memoryStorage();

// single file upload (field name = "file")
export const singleUpload = multer({ storage }).single("file");