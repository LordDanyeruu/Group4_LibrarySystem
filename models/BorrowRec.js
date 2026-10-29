const mongoose = require('mongoose');

const brwRecSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
    },
    borrowDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        required: [true, 'Due Date is required'],
    },
    returnDate: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ['Borrowed', 'Returned', 'Overdue'],
        default: 'Borrowed',
    },
},
{timestamps: true});

module.exports = mongoose.model('BorrowRecord', brwRecSchema);