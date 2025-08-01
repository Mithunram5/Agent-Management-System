import express from 'express';
import { body, param } from 'express-validator';
import { addAgent, listAgents, getAgent, editAgent, deleteAgent } from '../controllers/agentController.js';
import { verifyToken, adminOnly } from '../controllers/authController.js';

const router = express.Router();

// Validation rules for agent creation
const agentValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('mobile')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid mobile number with country code'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Validation rules for agent update
const agentUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('mobile')
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid mobile number with country code'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// ID parameter validation
const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid agent ID')
];

// Apply authentication middleware to all routes
router.use(verifyToken);
router.use(adminOnly);

// Routes
router.post('/', agentValidation, addAgent);
router.get('/', listAgents);
router.get('/:id', idValidation, getAgent);
router.put('/:id', [...idValidation, ...agentUpdateValidation], editAgent);
router.delete('/:id', idValidation, deleteAgent);

export default router;
