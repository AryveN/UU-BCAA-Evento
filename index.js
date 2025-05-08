require('dotenv').config();
const express    = require('express');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');

const eventRoutes   = require('./src/routes/event');
const expenseRoutes = require('./src/routes/expense');
const errorHandler  = require('./src/middleware/errorHandler');

const app = express();
app.use(bodyParser.json());

// Připojení a spuštění serveru jen pokud je hlavní modul
if (require.main === module) {
  const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/evento';
  mongoose.connect(dbURI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`🚀 Server listening on port ${port}`));
} else {
  // Pro testy a importování
  const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/evento';
  mongoose.createConnection(dbURI);
}

// Mount routes (vždy)
app.use('/api/event',   eventRoutes);
app.use('/api/expense', expenseRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;