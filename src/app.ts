import express, { Application, NextFunction, Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import helmet from "helmet";
import cors from "cors";
import appRoutes from "./routes/appRoutes";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(appRoutes);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Not found" });
});

export default app;
