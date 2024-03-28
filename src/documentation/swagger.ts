import swaggerAutogen from "swagger-autogen";
const apiDoc = {
  openapi: "3.0.0",
  info: {
    title: "MY BRAND API DOCUMENTATION",
    description: "Documentation for the Express API endpoints",
    version: "1.0.0",
    contact: {
      name: "Gisa M. Caleb",
      email: "gisacaleb72@gmail.com",
    },
  },
  servers: [
    {
      url: "https://my-brand-backend-iyxk.onrender.com",
      
    },
    {
      url: "http://localhost:4300",
      
    },
  ],
  paths: {},
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
const outputFilePath = "./swagger_output.json";
const endpointsFilePaths = ["../app.ts"];
swaggerAutogen({ openapi: "3.0.0" })(
  outputFilePath,
  endpointsFilePaths,
  apiDoc
);