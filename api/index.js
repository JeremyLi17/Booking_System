import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js';
import hotelsRoute from './routes/hotels.js';
import usersRoute from './routes/users.js';
import roomsRoute from './routes/rooms.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// if using node js, by default we should import library like
// const express = require('express');

const app = express();
dotenv.config();

// initial connection
const connectToMongoDB = async () => {
  mongoose.set('strictQuery', false);
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB');
  } catch (error) {
    // handle error
    throw error;
  }
};

/*
mongoose.connection.on('disconnected', () => {
  console.log('mongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('mongoDB connected');
});
*/

// middlewares
app.use(cors());
// allow user to send json as request body
app.use(express.json());
// storage jwt inside the cookie
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/hotels', hotelsRoute);
app.use('/api/users', usersRoute);
app.use('/api/rooms', roomsRoute);

// error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 'Something went wrong!';
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connectToMongoDB();
  console.log('Connected to backend on: localhost:8800');
});
