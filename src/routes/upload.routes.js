import express from 'express';
import upload from '../middlewares/multer.js';
import  uploadImage  from '../controllers/multerController.js';

const router = express.Router();

router.post('/upload', upload.single('file'), uploadImage);

export default router;
