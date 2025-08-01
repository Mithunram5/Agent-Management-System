import express from 'express';
import multer from 'multer';
import { param } from 'express-validator';
import { upload, uploadAndDistribute, getDistributedLists, getAgentDistributedList, getMyTasks } from '../controllers/listController.js';
import { verifyToken, adminOnly, agentOrAdmin } from '../controllers/authController.js';

const router = express.Router();

// ID parameter validation
const idValidation = [
  param('agentId')
    .isMongoId()
    .withMessage('Invalid agent ID')
];

// File upload error handler
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
  }

  if (error.message === 'Only CSV, XLSX, and XLS files are allowed') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
};

// Routes
router.post('/upload', verifyToken, adminOnly, upload.single('file'), handleUploadError, uploadAndDistribute);
router.get('/', verifyToken, adminOnly, getDistributedLists);
router.get('/agent/:agentId', verifyToken, agentOrAdmin, idValidation, getAgentDistributedList);
router.get('/my-tasks', verifyToken, agentOrAdmin, getMyTasks);

export default router;
