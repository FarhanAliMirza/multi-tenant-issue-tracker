import express from "express";
import {prisma} from "../lib/prisma";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.use(authenticate);

// GET /api/issues
router.get("/", async (req, res) => {
  const issues = await prisma.issue.findMany({
    where: { tenantId: req.user!.tenantId },
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { email: true } } },
  });
  res.json(issues);
});

// GET /api/issues/:id
router.get("/:id", async (req, res) => {
  const issue = await prisma.issue.findFirst({
    where: {
      id: req.params.id,
      tenantId: req.user!.tenantId,
    },
    include: { createdBy: { select: { email: true } } },
  });
  if (!issue) return res.status(404).json({ error: "Issue not found" });
  res.json(issue);
});

// POST /api/issues
router.post("/", async (req, res) => {
  const { title, description, priority } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  const issue = await prisma.issue.create({
    data: {
      title,
      description,
      priority: priority ?? "MEDIUM",
      status: "OPEN",
      tenantId: req.user!.tenantId,
      createdById: req.user!.userId,
    },
  });
  res.status(201).json(issue);
});

// PATCH /api/issues/:id
router.patch("/:id", async (req, res) => {
  const { title, description, status, priority } = req.body;
  try {
    const issue = await prisma.issue.update({
      where: {
        id: req.params.id,
        tenantId: req.user!.tenantId,
      },
      data: { title, description, status, priority },
    });
    res.json(issue);
  } catch (err: any) {
    if (err.code === "P2025")
      return res.status(404).json({ error: "Issue not found" });
    throw err;
  }
});

// DELETE /api/issues/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.issue.delete({
      where: {
        id: req.params.id,
        tenantId: req.user!.tenantId,
      },
    });
    res.status(204).send();
  } catch (err: any) {
    if (err.code === "P2025")
      return res.status(404).json({ error: "Issue not found" });
    throw err;
  }
});

export default router;
