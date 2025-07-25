import AWS from 'aws-sdk';
import dotenv from 'dotenv'

dotenv.config()

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  Bucket: process.env.AWS_BUCKET_NAME,
});

// Function to configure CORS for the S3 bucket
export const configureBucketCORS = async () => {
  try {
    const corsParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
            AllowedOrigins: ['*'],
            ExposeHeaders: ['ETag'],
            MaxAgeSeconds: 3000
          }
        ]
      }
    };

    await s3.putBucketCors(corsParams).promise();
    console.log('✅ S3 bucket CORS configured successfully');
  } catch (error) {
    console.error('❌ Error configuring S3 bucket CORS:', error);
  }
};

// Function to make an object publicly readable
export const makeObjectPublic = async (key) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ACL: 'public-read'
    };

    await s3.putObjectAcl(params).promise();
    console.log(`✅ Made object public: ${key}`);
  } catch (error) {
    console.error(`❌ Error making object public: ${key}`, error);
  }
};