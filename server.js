require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const Book = require('./models/Books');
const Member = require('./models/Member');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/borrow', require('./routes/borrowRoutes'));

app.get('/', (req, res) => {
    try {
        const [totalBooks, availableBooks, borrowedBooks, totalMembers] = await Promise.all([
            Book.countDocuments(),
            Book.countDocuments({ status: 'Available' }),
            Book.countDocuments({ status: 'Borrowed' }),
            Member.countDocuments()
        ]);
        res.status(200).json({ totalBooks, availableBooks, borrowedBooks, totalMembers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log('Server running on port ${PORT}'));
        })
    .catch(err => console.error('Could not connect to MongoDB', err));