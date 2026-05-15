import express from "express";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "../middlewares/error-handler.middleware";
import apiRouter from '../routes/index';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/status", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/", apiRouter);

app.use(errorHandler);