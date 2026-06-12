import express, { Response } from 'express';
import { auth, admin } from '../middleware/auth';
import { upload, uploadToCloudinary, deleteFromCloudinary } from '../utils/upload';

const router = express.Router();

router.post('/image', auth, admin, upload.single('image'), async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    const url = await uploadToCloudinary(req.file, 'products');
    res.status(201).json({ url });
  } catch (error: any) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

router.post('/receipt', auth, upload.single('receipt'), async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No receipt file provided' });
    }
    const url = await uploadToCloudinary(req.file, 'receipts');
    res.status(201).json({ url });
  } catch (error: any) {
    res.status(500).json({ message: 'Error uploading receipt', error: error.message });
  }
});

export default router;
