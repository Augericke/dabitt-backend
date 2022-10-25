import { Request, Response, NextFunction } from "express";

interface ErrorResponse {
  name: string;
  message: string;
}

export const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

export const errorHandler = (
  error: ErrorResponse,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "PrismaClientKnownRequestError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "UnauthorizedError") {
    return response.status(401).json({ error: error.message });
  }
  next(error);
};
