import express from 'express';
import multer from 'multer';
import https from 'https';
import http from 'http';
import { uploadImage, deleteImage } from '../Controllers/imageController.js';
import { protect } from '../Middleware/protectRoute.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
});

// Image proxy endpoint (public - no auth required for PDF generation)
router.get('/proxy', async (req, res) => {
    try {
        const imageUrl = req.query.url;
        
        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'URL parameter is required'
            });
        }

        console.log('Proxying image request for:', imageUrl);

        // Validate URL
        let parsedUrl;
        try {
            parsedUrl = new URL(imageUrl);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid URL provided'
            });
        }

        // Only allow specific domains for security
        const allowedDomains = [
            's3.amazonaws.com',
            'storagebucket2025.s3.amazonaws.com',
            'amazonaws.com',
            // Add other trusted domains as needed
        ];
        
        const isAllowed = allowedDomains.some(domain => 
            parsedUrl.hostname.includes(domain)
        );
        
        if (!isAllowed) {
            return res.status(403).json({
                success: false,
                message: 'Domain not allowed'
            });
        }

        // Choose http or https based on the URL
        const client = parsedUrl.protocol === 'https:' ? https : http;
        
        // Make request to the image URL
        const request = client.request(imageUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'BlogMagic-ImageProxy/1.0',
                'Accept': 'image/*',
            }
        }, (response) => {
            // Check if the response is successful
            if (response.statusCode !== 200) {
                console.error('Failed to fetch image:', response.statusCode, response.statusMessage);
                return res.status(response.statusCode).json({
                    success: false,
                    message: `Failed to fetch image: ${response.statusMessage}`
                });
            }

            // Set appropriate headers
            res.set({
                'Content-Type': response.headers['content-type'] || 'image/jpeg',
                'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            });

            console.log('Successfully proxying image');
            // Pipe the image data to the response
            response.pipe(res);
        });

        request.on('error', (error) => {
            console.error('Error fetching image:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch image',
                error: error.message
            });
        });

        request.setTimeout(30000, () => {
            console.error('Request timeout for image:', imageUrl);
            request.destroy();
            res.status(408).json({
                success: false,
                message: 'Request timeout'
            });
        });

        request.end();

    } catch (error) {
        console.error('Error in image proxy:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Protected routes (require authentication)
router.use(protect);

// Upload image
router.post('/upload', upload.single('image'), uploadImage);

// Delete image
router.delete('/:key', deleteImage);

// Test S3 image accessibility
router.get('/test/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { s3 } = await import('../utils/s3.js');
        
        // Generate a presigned URL for testing
        const presignedUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Expires: 3600 // 1 hour
        });
        
        res.json({
            success: true,
            presignedUrl: presignedUrl,
            message: 'Test URL generated successfully'
        });
    } catch (error) {
        console.error('Error generating test URL:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate test URL',
            error: error.message
        });
    }
});

export default router;

