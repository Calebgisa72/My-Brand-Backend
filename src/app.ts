import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import swaggerOutput from "./documentation/swagger_output.json";
import { mongoConnect } from "./utils/mongo";
import router from "./routes";

dotenv.config();

const app = express();
const PORT = 4300;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mybranddb";

app.use(express.json());

app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome To My Brand");
});

app.use("/api",router)

mongoConnect(MONGODB_URI)
  .then(() => {
    app.listen(PORT);
    console.log("Server started on port", PORT);
  })
  .catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
  });

export default app;
