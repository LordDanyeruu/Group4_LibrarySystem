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
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    memberID: {
        type: String,
        required: [true, 'Member ID is required'],
        unique: true,
        trim: true,
        default: () => Math.floor(100000 + Math.random() * 900000),
    },
},
{timestamps: true});

module.exports = mongoose.model('Member', mbrSchema);