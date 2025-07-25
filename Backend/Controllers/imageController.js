import { s3, makeObjectPublic } from '../utils/s3.js';
import {catchAsync} from '../utils/catchAsync.js';

// Upload a single image to S3
export const uploadImage = catchAsync(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            status: 'error',
            message: 'No file uploaded'
        });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const key = `images/${fileName}`;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read',
        CacheControl: 'max-age=31536000', // 1 year cache
        Metadata: {
            'original-name': req.file.originalname,
            'upload-date': new Date().toISOString()
        }
    };

    try {
        const uploadResult = await s3.upload(params).promise();
        
        // Ensure the object is publicly readable
        await makeObjectPublic(key);
        
        // Generate a presigned URL that will work for PDF generation
        const presignedUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Expires: 3600 // 1 hour
        });

        res.status(200).json({
            status: 'success',
            data: {
                imageUrl: uploadResult.Location,
                presignedUrl: presignedUrl,
                key: key
            }
        });
    } catch (error) {
        console.error('Error uploading image to S3:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to upload image'
        });
    }
});

// Delete an image from S3
export const deleteImage = catchAsync(async (req, res) => {
    const { key } = req.params;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    };

    await s3.deleteObject(params).promise();

    res.status(200).json({
        status: 'success',
        message: 'Image deleted successfully'
    });
});

