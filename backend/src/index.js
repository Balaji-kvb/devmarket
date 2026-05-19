const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Health Check Endpoint (Used by Prometheus/Docker)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'devmarket-backend',
    timestamp: new Date().toISOString()
  });
});

// API Routes Placeholder
app.get('/api/v1/status', (req, res) => {
  res.json({ message: 'DevMarket Backend API is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Backend API Server running on port ${PORT}`);
});
