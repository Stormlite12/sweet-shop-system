// src/server.js
import app from './app.js';
import connectDB from './config/db.js';

// Connect to the database
connectDB();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));