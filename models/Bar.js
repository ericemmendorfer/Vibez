import mongoose from 'mongoose';

const barSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    photos: [{
        url: String,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: String,
        photos: [String],
        createdAt: {
            type: Date,
            default: Date.now
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    }],
    operatingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },
    features: [{
        type: String,
        enum: ['Live Music', 'Sports Bar', 'Dance Floor', 'Outdoor Seating', 'Food Service', 'Happy Hour']
    }],
    priceRange: {
        type: String,
        enum: ['$', '$$', '$$$', '$$$$']
    },
    website: String,
    phoneNumber: String,
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for location-based queries
barSchema.index({ location: '2dsphere' });
// Index for text search
barSchema.index({ name: 'text', 'address.city': 'text' });

const Bar = mongoose.model('Bar', barSchema);

export default Bar; 