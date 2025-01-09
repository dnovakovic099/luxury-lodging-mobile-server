import express, { Application, NextFunction, Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app: Application = express();

// Middlewares
app.use(express.json());


app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Not found" });
});

export default app;
