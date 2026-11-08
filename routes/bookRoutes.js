const express = require('express');
const router = express.Router();
const Book = require('../models/Books');

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function handleError(res, error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
        return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
}

router.get('/', async (req, res) => {
    try {
        const { search, status } = req.query;
        const filter = {};

        if (search && search.trim() !== '') {
            const regex = new RegExp(escapeRegex(search.trim()), 'i');   // 'i' = ignore case
            filter.$or = [{ title: regex }, { author: regex }, { category: regex }];
        }
        if (status) {
            filter.status = status;
        }

        const books = await Book.find(filter).sort({ createdAt: 1 });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        handleError(res, error);
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, author, category, color, height, desc } = req.body;

        if (!title || !title.trim() || !category || !category.trim()) {
            return res.status(400).json({ message: 'Title and category are required' });
        }

        const newBook = await Book.create({
            title,
            author: author || 'Unknown Author',
            category,
            color: color || 'blue',
            height: height || Math.floor(Math.random() * 14) + 140,
            desc: desc || `Registered ${category} volume in The Index library catalog.`,
        });                     

        res.status(201).json(newBook);
    } catch (error) {
        handleError(res, error);
    }
});


router.put('/:id', async (req, res) => {
    try {
        const allowed = ['title', 'author', 'category', 'color', 'height', 'desc'];
        const updates = {};
        allowed.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }   
        );

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(updatedBook);
    } catch (error) {
        handleError(res, error);
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.status === 'Borrowed') {
            return res.status(400).json({ message: 'Cannot delete a book while it is borrowed' });
        }

        await book.deleteOne();   
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
});

module.exports = router;