const mongoose = require('mongoose');

const bkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Book title is required'],
        trim: true,
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['Available', 'Borrowed'],
        default: 'Available',
    },
    color: {
        type: String,
        enum: ['blue', 'slate', 'green', 'red', 'amber'],
        default: 'blue',
    },
    height: {
        type: Number,
        default: 146,
    },
    desc: {
        type: String,
        default: 'Registered volume in The Index library catalog.',
    },
},
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});


bkSchema.virtual('borrowed').get(function () {
    return this.status === 'Borrowed';
});

module.exports = mongoose.model('Book', bkSchema);