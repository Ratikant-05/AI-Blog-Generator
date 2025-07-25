import express from 'express';
import { protect } from '../Middleware/protectRoute.js';
import { analyzeBlogModification, testGeminiAPI } from '../Controllers/contentController.js';

const router = express.Router();

// Protected routes (require authentication)
router.use(protect);

// Content modification routes
router.post('/analyze', analyzeBlogModification);
router.get('/test-gemini', testGeminiAPI);

export default router; 