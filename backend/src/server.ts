import dotenv from "dotenv";
import express from "express";

import { errorMiddleware } from "./middleware/error.middleware";
import { authRouter } from "./routes/auth.routes";
import { issueRouter } from "./routes/issue.routes";

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

app.use("/auth", authRouter);
app.use("/issues", issueRouter);

app.use((_req, _res, next) => {
  const error = new Error("Route not found");
  (error as Error & { statusCode: number }).statusCode = 404;
  next(error);
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
