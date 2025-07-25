import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true,
        maxlength: [200, 'Blog title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Blog content is required'],
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    summary: {
        type: String,
        trim: true,
        maxlength: [500, 'Summary cannot exceed 500 characters']
    },
    keywords: [{
        type: String,
        trim: true
    }],
    featuredImage: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    category: {
        type: String,
        required: [true, 'Blog category is required'],
        trim: true
    },
    readTime: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    metadata: {
        type: Map,
        of: String,
        default: new Map()
    },
    isAIGenerated: {
        type: Boolean,
        default: true
    },
    generationPrompt: {
        type: String,
        trim: true
    },
    modificationCount: {
        type: Number,
        default: 0
    },
    chatHistory: [{
        content: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['user', 'ai'],
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for faster queries
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ title: 'text', content: 'text' }); // Text search index

// Virtual populate for comments if you implement them later
blogSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'blog',
    localField: '_id'
});

// Pre-save middleware to calculate read time
blogSchema.pre('save', function(next) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
