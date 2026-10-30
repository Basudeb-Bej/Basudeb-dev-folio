const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRouter');
const chatRoutes = require('./routes/chatbotRouter');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const startServer = async () => {
  await connectDB();

  app.use('/api/contact', contactRoutes);
  app.use('/api/chat', chatRoutes);

  app.get('/', (req, res) => {
    res.send('Portfolio API is running');
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error('Server startup failed:', error.message);
  process.exit(1);
});