import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/authRoutes.js';
import chatRoutes from './Routes/chatRoutes.js';
import blogRoutes from './Routes/blogRoutes.js';
import imageRoutes from './Routes/imageRoute.js';
import contentRoutes from './Routes/contentRoutes.js';
import { configureBucketCORS } from './utils/s3.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000', 'http://localhost:4444', 'http://localhost:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Accept']
}));

// Serve static files from the Frontend directory
app.use(express.static(path.join(__dirname, '../Frontend')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/content', contentRoutes);

// Add logging middleware to track all requests
app.use((req, res, next) => {
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Default route - serve login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/login.html'));
});

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-generator';
mongoose.connect(mongoURI)
    .then(() => {
        console.log('📊 Database:', mongoURI);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        console.log('💡 Make sure MongoDB is running or set MONGODB_URI environment variable');
        process.exit(1);
    });

// Configure S3 bucket CORS on server start
if (process.env.AWS_BUCKET_NAME) {
    configureBucketCORS().then(() => {
        console.log('✅ S3 bucket CORS configuration completed');
    }).catch(err => {
        console.warn('⚠️ S3 CORS configuration failed (this is normal if AWS credentials are not set):', err.message);
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('🚨 Unhandled error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        timestamp: new Date().toISOString()
    });
    
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Handle 404 errors
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    // Server started
    console.log(`Server is running on port ${PORT}`);
});
