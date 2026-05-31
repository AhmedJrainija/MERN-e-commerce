import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { AppError } from '../8-utils/custom error class.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/products/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = (  req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {

  const allowed = ["image/jpeg", "image/png"];

  if (!allowed.includes(file.mimetype)) {
    return cb(new AppError("Only JPEG and PNG images are allowed", 400) as any, false);
  }

  cb(null, true);
};

export const upload = multer({storage: storage, 
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,  // 5MB
    files: 1,                   // Max 3 files
    //fields: 2,                  // Max 2 fields (file input fields)
  }
  })