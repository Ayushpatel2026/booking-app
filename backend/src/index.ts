import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from "mongoose";
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use("/api/auth", authRoutes);
// any request with /api/users will be handled by the userRoutes
app.use('/api/users', userRoutes);

app.listen(7000, () => {
  console.log('Server is running on port 7000');
});
