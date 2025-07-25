import express from 'express';
import { saveMessage, getChatHistory, getRecentMessages, deleteChatHistory } from '../Controllers/chatController.js';
import { protect } from '../Middleware/protectRoute.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Chat routes
router.post('/messages', saveMessage);
router.get('/messages', getChatHistory);
router.get('/messages/recent', getRecentMessages);
router.delete('/messages', deleteChatHistory);

export default router; 