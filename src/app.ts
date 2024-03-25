import express from 'express';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import blogRoutes from './routes/blogRoutes';
import commentRoutes from './routes/commentRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './documentation/swagger_output.json';
import { mongoConnect, mongoDisconnect } from './utils/mongo';

dotenv.config();

const app = express();
const PORT = 4300;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mybranddb';

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome To My Brand');
})

app.use('/api', blogRoutes
/*
#swagger.tags = ['BLOG']
*/
);

app.use('/api/auth', authRoutes 
 /*
#swagger.tags = ['USER']
*/
);

app.use('/api', commentRoutes
/*
#swagger.tags = ['COMMENT']
*/
);

mongoConnect(MONGODB_URI)
    .then(() => {
        app.listen(PORT);
    })
    .catch((error) => {
        console.error('Error starting server:', error);
        process.exit(1);
    });


    export default app;