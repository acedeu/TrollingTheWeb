const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const URL = process.env.MONGO_URL;
const client = new MongoClient(URL);
let counterCollection;

async function connectDB() {
    try {
        await client.connect();
        const db = client.db('helpfulDB');
        counterCollection = db.collection('counters');

        const counter = await counterCollection.findOne({ _id: 'helpfulCounter' });
        if (!counter) {
            await counterCollection.insertOne({ _id: 'helpfulCounter', count: 0 });
        }

        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}
connectDB();

app.get('/counter', async (req, res) => {
    try {
        const counter = await counterCollection.findOne({ _id: 'helpfulCounter' });
        res.json({ count: counter.count });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch counter' });
    }
});

app.post('/counter', async (req, res) => {
    try {
        const updated = await counterCollection.findOneAndUpdate(
            { _id: 'helpfulCounter' },
            { $inc: { count: 1 } },
            { returnDocument: 'after' }
        );
        res.json({ count: updated.value.count });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update counter' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
