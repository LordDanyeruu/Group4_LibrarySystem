const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

router.get('/', async (req, res) => {
    try {
        const members = await Member.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, contactNumber, password } = req.body;

        if (!name || !email || !contactNumber || !password) {
            return res.status(400).json({
                message: 'Name, email, contact number, and password are required',
            });
        }

        const newMember = await Member.create({ name, email, contactNumber, password });

        const result = newMember.toObject();   
        delete result.password;               
        res.status(201).json(result);
    } catch (error) {
       
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Email, contact number, or member ID already exists',
            });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;