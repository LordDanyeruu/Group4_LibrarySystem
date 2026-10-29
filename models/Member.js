const mongoose = require('mongoose');

const mbrSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact Number is required'],
        trim: true,
        unique: true,
    },
    memberID: {
        type: String,
        required: [true, 'Member ID is required'],
        unique: true,
        trim: true,
    },
},
{timestamps: true});

module.exports = mongoose.model('Member', mbrSchema);