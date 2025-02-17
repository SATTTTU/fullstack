import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Make sure this path is correct
import authRoutes from './routes/authRoute.js'
import cors from 'cors'
import categoryRoutes from './routes/categoryRoutes.js';
import productRoute from './routes/productRoute.js';
import path from 'path';
import { fileURLToPath } from "url";
import fs from 'fs';

// ✅ Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (!fs.existsSync(__dirname)) {
    fs.mkdirSync(__dirname, { recursive: true });
    console.log('Uploads directory created');
}

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

dotenv.config(); // Load environment variables from .env file

app.use(cors())
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/product',productRoute);

connectDB(); // Connect to the database

app.get('/', (req, res) => {
    res.send({
        message: "Hello world"
    });
});

const PORT = process.env.PORT || 3000; // Use a default port if not specified in environment variables

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.DEV_MODE} mode on port ${PORT}`);
});
