
import swaggerJsdoc from 'swagger-jsdoc';

// Swagger options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MY BRAND API DOCUMENTATION',
      description: 'Documentation for the Express API endpoints',
      version: '1.0.0',
      contact: {
        name: 'Gisa M. Calebb',
        email: 'gisacaleb72@gmail.com',
      },
    },
    servers: [
      {
        url: 'https://my-brand-backend-iyxk.onrender.com',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['../app.ts', '../routes/*.ts'], 
};

const swaggerSpec = swaggerJsdoc(options);