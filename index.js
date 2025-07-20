import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import baggageRoutes from './routes/baggageRoutes.js';

const app = express();
app.use(express.json());
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => {
  console.error("MongoDB connection failed:", err);
});


app.use('/baggage', baggageRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
