import express from 'express';
import { protect } from '../Middleware/protectRoute.js';
import {
    createBlog,
    getAllBlogs,
    getUserBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    humanizeBlogContent,
    getBlogWithChatHistory,
    updateBlogChatHistory,
    generateBlogContent,
    refinePromptForKeywords
} from '../Controllers/blogController.js';

const router = express.Router();

// Add logging middleware for debugging
router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, {
        body: req.body,
        params: req.params,
        user: req.user ? req.user._id : 'No user'
    });
    next();
});

// Protected routes (require authentication)
router.use(protect);

router.post('/humanize', humanizeBlogContent);
router.post('/generate', generateBlogContent);
router.post('/refine-keywords', refinePromptForKeywords);

// Blog CRUD operations
router.post('/', createBlog);
router.get('/', getAllBlogs);
router.get('/user', getUserBlogs);
// Specific routes before generic /:id route
router.get('/:id/with-chat', getBlogWithChatHistory);
router.get('/:id/debug', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        
        const Blog = (await import('../Models/blogModel.js')).default;
        const blog = await Blog.findOne({ _id: id, author: userId });
        
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        
        res.json({
            blogId: blog._id,
            title: blog.title,
            chatHistoryExists: !!blog.chatHistory,
            chatHistoryLength: blog.chatHistory ? blog.chatHistory.length : 0,
            chatHistory: blog.chatHistory,
            lastUpdated: blog.updatedAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/:id', getBlog);
router.patch('/:id/chat', updateBlogChatHistory);
router.patch('/:id', updateBlog);
router.delete('/:id', deleteBlog);

// Test endpoint
router.get('/test/endpoint', (req, res) => {
    res.json({ message: 'Blog routes working', timestamp: new Date() });
});

// Test chat route specifically
router.patch('/test/chat', (req, res) => {
    res.json({ message: 'Chat route working', timestamp: new Date() });
});

// Debug endpoint to check blog existence
router.get('/debug/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        
        console.log('Debug request:', { blogId: id, userId: userId });
        
        const Blog = (await import('../Models/blogModel.js')).default;
        const blog = await Blog.findOne({ _id: id, author: userId });
        
        if (!blog) {
            return res.status(404).json({ 
                error: 'Blog not found',
                blogId: id,
                userId: userId,
                exists: false
            });
        }
        
        res.json({
            blogId: blog._id,
            title: blog.title,
            chatHistoryExists: !!blog.chatHistory,
            chatHistoryLength: blog.chatHistory ? blog.chatHistory.length : 0,
            lastUpdated: blog.updatedAt,
            exists: true
        });
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({ 
            error: error.message,
            stack: error.stack
        });
    }
});

// Duplicate route removed - moved above

export default router; 