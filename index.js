import express from 'express';
import mongoose from 'mongoose';
import baggageRoutes from './routes/baggageRoutes.js';

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/baggageDB', {
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
