import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { AppError } from '../8-utils/custom error class.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { env } from '../1-config/env.js';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'harmony/products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  } as any,
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowed = ["image/jpeg", "image/png"];

  if (!allowed.includes(file.mimetype)) {
    return cb(new AppError("Only JPEG and PNG images are allowed", 400) as any, false);
  }

  cb(null, true);
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  }
});