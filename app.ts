import express, { Express } from "express";
import cors from "cors";
import { unknownEndpoint, errorHandler } from "./utils/errorHandlers";
import { checkJwt } from "./utils/auth0";

require("express-async-errors");
import userRouter from "./routes/user";
import categoryRouter from "./routes/category";
import taskRouter from "./routes/task";
import analyticsRouter from "./routes/analytics";

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", checkJwt, userRouter);
app.use("/api/category", checkJwt, categoryRouter);
app.use("/api/category/:categoryId/task", checkJwt, taskRouter);
app.use("/api/data", checkJwt, analyticsRouter);

// Error Handling
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
