import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskRoutes from './Routes/TaskRoutes.js'

const app = express();
const port = process.env.PORT || 8000;



dotenv.config({});


app.use(express.json());

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
 .then(() => 
    console.log('MongoDB connected Successfully ')
)
 .catch(()=> 
    console.log('Failed to Connect'))

app.use('/tasks', taskRoutes);

app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
}
);


