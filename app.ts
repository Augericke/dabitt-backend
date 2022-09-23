import express, { Express, Request, Response } from "express";
import cors from "cors";
import { unknownEndpoint, errorHandler } from "./utils/errorHandlers";
require("express-async-errors");

import userRouter from "./routes/user";

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRouter);

// Error Handling
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
