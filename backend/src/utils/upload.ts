import { v2 as cloudinary } from 'cloudinary';
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

interface UploadFile {
  buffer: Buffer;
  mimetype: string;
}

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req: Request, file: any, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export const uploadToCloudinary = async (file: UploadFile, folder: string): Promise<string> => {
  const b64 = Buffer.from(file.buffer).toString('base64');
  const dataURI = `data:${file.mimetype};base64,${b64}`;
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: `riya-touch/${folder}`,
    resource_type: 'auto'
  });
  return result.secure_url;
};

export const deleteFromCloudinary = async (url: string) => {
  const publicId = url.split('/').slice(-2).join('/').split('.')[0];
  await cloudinary.uploader.destroy(`riya-touch/${publicId}`);
};
