import express from 'express';
import authRouter from './routes/auth.route.js'
import messageRouter from './routes/message.route.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from 'path';
import { connectDB } from './lib/db.config.js';
import { server, app, io } from './lib/socket.js'
dotenv.config();

const __dirname = path.resolve();

// const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))


app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter)

if (process.env.NODE_ENV) {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'));
  }
  );
}

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
  connectDB();
});