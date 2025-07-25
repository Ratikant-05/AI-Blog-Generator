import ChatMessage from '../Models/chatMessagesModel.js';
import { catchAsync } from '../utils/catchAsync.js';

// Store a new message (from either user or bot)
export const saveMessage = catchAsync(async (req, res) => {

    const { content, senderType } = req.body;
    const userId = req.user._id; // Assuming user is authenticated

    const message = await ChatMessage.create({
        content,
        senderType,
        userId,
        metadata: req.body.metadata || {}
    });

    res.status(201).json({
        status: 'success',
        data: {
            message
        }
    });
});

// Get chat history for a user
export const getChatHistory = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await ChatMessage.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalMessages = await ChatMessage.countDocuments({ userId });

    res.status(200).json({
        status: 'success',
        data: {
            messages,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalMessages / limit),
                totalMessages
            }
        }
    });
});

// Delete chat history
export const deleteChatHistory = catchAsync(async (req, res) => {
    const userId = req.user._id;
    
    await ChatMessage.deleteMany({ userId });

    res.status(200).json({
        status: 'success',
        message: 'Chat history deleted successfully'
    });
});

// Get recent messages
export const getRecentMessages = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    const messages = await ChatMessage.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);

    res.status(200).json({
        status: 'success',
        data: {
            messages
        }
    });
}); 