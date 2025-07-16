require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const ClaimHistory = require('./models/ClaimHistory');

const app = express();
// app.use(cors());
app.use(cors({
  origin: 'https://lb-frontend-nine.vercel.app/' 
}));

app.use(express.json());

// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.MONGODB_URI);

   // Get all users
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

   // Add a new user
app.post('/users', async (req, res) => {
const newUser = new User({ name: req.body.name });
    await newUser.save();
    res.json(newUser);
});

   // Claim points
app.post('/claim/:userId', async (req, res) => {
    const userId = req.params.userId;
       const pointsClaimed = Math.floor(Math.random() * 10) + 1;

    const user = await User.findByIdAndUpdate(userId, { $inc: { points: pointsClaimed } }, { new: true });
    const claimHistory = new ClaimHistory({ userId, pointsClaimed });
    await claimHistory.save();

    res.json({ user, pointsClaimed });
});

   // Get rankings
app.get('/rankings', async (req, res) => {
    const users = await User.find().sort({ points: -1 });
    res.json(users);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
