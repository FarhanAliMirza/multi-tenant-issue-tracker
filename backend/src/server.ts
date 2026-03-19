import dotenv from "dotenv";
import express from "express";

import { errorMiddleware } from "./middleware/error.middleware";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 5000);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend server is running",
  });
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
