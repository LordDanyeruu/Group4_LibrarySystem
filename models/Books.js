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
    isbn: {
        type: String,
        required: [true, 'ISBN is required'],
        unique: true,
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
},
{timestamps: true});

module.exports = mongoose.model('Book', bkSchema);
