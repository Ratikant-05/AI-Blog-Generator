import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Message content is required'],
        trim: true
    },
    senderType: {
        type: String,
        enum: ['user', 'bot'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: new Map()
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
chatMessageSchema.index({ userId: 1, createdAt: -1 });

// Create a compound index for user-specific message searches
chatMessageSchema.index({ userId: 1, senderType: 1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
