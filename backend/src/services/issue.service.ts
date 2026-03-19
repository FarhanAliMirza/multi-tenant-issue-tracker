import { prisma } from "../lib/prisma";
import type { JwtPayload } from "../utils/jwt";
import type {
  CreateIssueInput,
  UpdateIssueInput,
} from "../validations/issue.schema";

type ServiceError = Error & { statusCode: number };

const createServiceError = (
  message: string,
  statusCode: number,
): ServiceError => {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
};

const getIssueByIdForTenant = async (user: JwtPayload, issueId: string) => {
  return await prisma.issue.findFirst({
    where: {
      id: issueId,
      tenantId: user.tenantId,
    },
  });
};

export const getIssues = async (user: JwtPayload) => {
  return await prisma.issue.findMany({
    where: {
      tenantId: user.tenantId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createIssue = async (
  user: JwtPayload,
  input: CreateIssueInput,
) => {
  return await prisma.issue.create({
    data: {
      title: input.title,
      description: input.description,
      tenantId: user.tenantId,
      reporterId: user.userId,
    },
  });
};

export const getIssueById = async (user: JwtPayload, issueId: string) => {
  const issue = await getIssueByIdForTenant(user, issueId);

  if (!issue) {
    throw createServiceError("Issue not found", 404);
  }

  return issue;
};

export const updateIssue = async (
  user: JwtPayload,
  issueId: string,
  input: UpdateIssueInput,
) => {
  const updatedResult = await prisma.issue.updateMany({
    where: {
      id: issueId,
      tenantId: user.tenantId,
    },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    },
  });

  if (updatedResult.count === 0) {
    throw createServiceError("Issue not found", 404);
  }

  const issue = await getIssueByIdForTenant(user, issueId);

  if (!issue) {
    throw createServiceError("Issue not found", 404);
  }

  return issue;
};

export const deleteIssue = async (user: JwtPayload, issueId: string) => {
  const deletedResult = await prisma.issue.deleteMany({
    where: {
      id: issueId,
      tenantId: user.tenantId,
    },
  });

  if (deletedResult.count === 0) {
    throw createServiceError("Issue not found", 404);
  }
};
