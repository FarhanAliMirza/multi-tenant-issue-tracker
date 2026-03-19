import { z } from "zod";

const issueStatusSchema = z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]);

export const createIssueSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
});

export const updateIssueSchema = z
  .object({
    title: z.string().trim().min(1, "Title cannot be empty").optional(),
    description: z
      .string()
      .trim()
      .min(1, "Description cannot be empty")
      .optional(),
    status: issueStatusSchema.optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.status !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export const issueIdParamSchema = z.object({
  id: z.uuid("Invalid issue id"),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;
export type IssueIdParamInput = z.infer<typeof issueIdParamSchema>;
export type IssueStatusInput = z.infer<typeof issueStatusSchema>;
