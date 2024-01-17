import express from 'express';
import mongoose from 'mongoose';
import { createSession, joinSession } from './routes/sessions';
import cors from "cors";

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const mongoUri = process.env.MONGODB || 'undefined';
app.use(express.json());
app.use(cors());
// Connect to MongoDB
mongoose.connect(mongoUri);

// Routes
app.post('/createSession', createSession);
app.post('/joinSession', joinSession);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
