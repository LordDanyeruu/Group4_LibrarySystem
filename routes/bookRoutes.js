const express = require('express');
const router = express.Router();
const Book = require('../models/Books');

router.get('/', async (req, res) => {
    try {
        const {search} = req.query;
        let filter = {};
        if (search && search.trim() !== '') {
            const regex = new RegExp(search.trim(), 'i');
            filter = { $or: [{ title: regex }, { author: regex }, { category: regex }]
    };
}
    const books = await Book.find(filter).sort({ createdAt: 1 });
    res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const {title, author, category, status, color, height, desc} = req.body;
        if (!title || !category) {
            return res.status(400).json({ message: 'Title and category are required' });
        }
        const newBook = await Book.create({ 
            title,
            author = author || 'Unknown Author',
            category,
            status: 'Available',
            color: color || 'blue',
            height: height || Math.floor(Math.random() * 14) + 140,
            desc: desc || `Registered ${category} volume in The Index library catalog.`
        });
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.status === 'Borrowed') {
            return res.status(400).json({ message: 'Cannot delete a borrowed book' });
        }
        await Book.deleteOne();
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;