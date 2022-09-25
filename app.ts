import express, { Express, Request, Response } from "express";
import cors from "cors";
import { unknownEndpoint, errorHandler } from "./utils/errorHandlers";
import { checkJwt } from "./utils/auth0";

import userRouter from "./routes/user";
import categoryRouter from "./routes/category";
import taskRouter from "./routes/task";

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", checkJwt, userRouter);
app.use("/api/category", checkJwt, categoryRouter);
app.use("/api/task", checkJwt, taskRouter);

app.get("/authorized", checkJwt, function (req, res) {
  res.send("Secured Resource");
});

// Error Handling
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
