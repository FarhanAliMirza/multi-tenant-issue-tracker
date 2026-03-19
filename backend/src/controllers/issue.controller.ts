import type { Request, RequestHandler } from "express";

import {
  createIssueSchema,
  issueIdParamSchema,
  updateIssueSchema,
} from "../validations/issue.schema";
import {
  createIssue as createIssueService,
  deleteIssue as deleteIssueService,
  getIssueById as getIssueByIdService,
  getIssues as getIssuesService,
  updateIssue as updateIssueService,
} from "../services/issue.service";

type ServiceError = Error & { statusCode: number };

const getAuthenticatedUser = (req: Request) => {
  if (!req.user) {
    const error = new Error("Unauthorized") as ServiceError;
    error.statusCode = 401;
    throw error;
  }

  return req.user;
};

export const getIssuesController: RequestHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const issues = await getIssuesService(user);

    res.status(200).json({
      success: true,
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};

export const createIssueController: RequestHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const input = createIssueSchema.parse(req.body);
    const issue = await createIssueService(user, input);

    res.status(201).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

export const getIssueByIdController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const user = getAuthenticatedUser(req);
    const { id } = issueIdParamSchema.parse(req.params);
    const issue = await getIssueByIdService(user, id);

    res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

export const updateIssueController: RequestHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const { id } = issueIdParamSchema.parse(req.params);
    const input = updateIssueSchema.parse(req.body);
    const issue = await updateIssueService(user, id, input);

    res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteIssueController: RequestHandler = async (req, res, next) => {
  try {
    const user = getAuthenticatedUser(req);
    const { id } = issueIdParamSchema.parse(req.params);
    await deleteIssueService(user, id);

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
