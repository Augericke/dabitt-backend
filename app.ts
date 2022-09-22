import express, { Express, Request, Response } from "express";
import cors from "cors";
import { unknownEndpoint, errorHandler } from "./utils/errorHandlers";

const app: Express = express();
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("hello dabitt");
});

// Error Handling
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
