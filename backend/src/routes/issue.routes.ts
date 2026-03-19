import { Router } from "express";

import {
  createIssueController,
  deleteIssueController,
  getIssueByIdController,
  getIssuesController,
  updateIssueController,
} from "../controllers/issue.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { tenantMiddleware } from "../middleware/tenant.middleware";

const issueRouter = Router();

issueRouter.use(authMiddleware, tenantMiddleware);

issueRouter.get("/", getIssuesController);
issueRouter.post("/", createIssueController);
issueRouter.get("/:id", getIssueByIdController);
issueRouter.patch("/:id", updateIssueController);
issueRouter.delete("/:id", deleteIssueController);

export { issueRouter };
