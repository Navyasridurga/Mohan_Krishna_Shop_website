require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { initSchema } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Make sure tables exist before we start handling requests
initSchema();

const app = express();

// ---- Core middleware ----
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',');
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ---- Health check ----
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Mohan Krishna Juice & Fried Rice API is running.' });
});

// ---- Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);

// ---- Error handling (must be last) ----
app.use(notFound);
app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
module.exports = app;