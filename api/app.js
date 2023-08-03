import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import mongoose from 'mongoose';


const app = express();
const PORT = process.env.PORT

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use('/users', userRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/leetdb').then(() => {
    console.log('Database synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
