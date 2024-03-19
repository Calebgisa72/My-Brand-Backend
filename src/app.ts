import express from 'express';
import { Request,Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import blogRoutes from './routes/blogRoutes';
import commentRoutes from './routes/commentRoutes';
import swaggerUi from "swagger-ui-express";
import swaggerOutPut from "./documentation/swagger_output.json";

dotenv.config();

const app = express();
const PORT = 4300;
const MONGODB_URI = process.env.MONGODB_URI || "1000";

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutPut));

app.get('/', (req:Request,res: Response)=> {
    res.send("Welcome To My Brand")
});

app.use('/api', blogRoutes);

app.use('/api/auth', authRoutes);

app.use('/api', commentRoutes);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => console.error(error));
