const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const pgRoutes = require('./routes/pgRoutes');
const authRoutes = require('./routes/authRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const PORT = process.env.PORT || 5000;

// Load env variables
dotenv.config();

// Connect to DB
connectDB();

// Initialize app
const app = express();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/pgs', pgRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/owner', ownerRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
