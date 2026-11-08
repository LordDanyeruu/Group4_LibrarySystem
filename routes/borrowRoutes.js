const express = require('express');
const router = express.Router();
const Book = require('../models/Books');
const Member = require('../models/Member');
const BorrowRecord = require ('../models/BorrowRec');

router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const records = await BorrowRecord.find(filter)
        .populate('book', 'title autor category')
        .populate('member', 'name memberID')
        .sort({borrowDate: -1});
        
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/', async (req, res) => {
    try {
        const {book, member, duedate} = req.body;

        if (!book || !member || !duedate) {
            return res.status(400).json({message: 'Book, member, and due date are required'});
        }

        const bookDoc = await Book.findById(book);
        if (!bookDoc) {
            return res.status(404).json({message: 'Book not found'});
        }
        const memberDoc = await Member.findById(member)
        if (!memberDoc) {
            return res.status(404).json({message: 'Member not found'});
        }

        if (bookDoc.status !== 'Available') {
            return res.status(404).json({message: 'This book is already borrowed'});
        }

        const record = await BorrowRecord.create({book, member, duedate});
        bookDoc.status = 'Borrowed';
        await bookDoc.save();

        res.status(201).json(record);
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: error.message});
    }
});

router.put('/:id/return', async (req, res) => {
    try {
        const record = await BorrowRecord.findById(req.params.id);
        if (!record) {
            return res.status(404).json({message: 'Borrow record not found'});
        }
        if (record.status === 'Returned') {
            return res.status(404).json({message: 'This book was already returned'});
        }

        record.status = 'Returned';
        record.returnDate = new Date();
        await record.save();

        await Book.findByIdAndUpdate(record.book, {status: 'Available'});

        res.status(200).json({message: 'Book returned successfully', record});
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({message: 'Invalid record id'});
        }
        res.status(500).json({message: error.message});
    }
});

module.exports = router;