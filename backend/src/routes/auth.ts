import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { email, password, tenantSlug } = req.body;
  if (!email || !password || !tenantSlug) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  const existingUser = await prisma.user.findFirst({
    where: { email, tenantId: tenant.id },
  });
  if (existingUser)
    return res.status(409).json({ error: "User already exists" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      tenantId: tenant.id,
      name: email.split("@")[0],
    },
  });
  const token = jwt.sign(
    { userId: user.id, tenantId: tenant.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ message: "Registered", user: { id: user.id, email: user.email } });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign(
    { userId: user.id, tenantId: user.tenantId },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({
    message: "Logged in",
    user: { id: user.id, email: user.email, tenantId: user.tenantId },
  });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out" });
});

export default router;
