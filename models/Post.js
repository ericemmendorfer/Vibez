import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bar',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 1000
    },
    photos: [{
        url: String,
        caption: String
    }],
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            required: true,
            maxlength: 500
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [{
        type: String,
        trim: true
    }],
    visibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'public'
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    }
}, {
    timestamps: true
});

// Indexes
postSchema.index({ location: '2dsphere' });
postSchema.index({ content: 'text' });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ bar: 1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post; 