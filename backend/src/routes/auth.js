import express from 'express';
import { body } from 'express-validator';
import { login } from '../controllers/authController.js';

const router = express.Router();

// Login validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Routes
router.post('/login', loginValidation, login);

export default router;
