import { prisma } from "../src/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  // Clear existing data
  await prisma.issue.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  // Create tenants
  const tenants = await prisma.tenant.createMany({
    data: [
      { name: "Acme Corp", slug: "acme" },
      { name: "Globex Inc", slug: "globex" },
      { name: "Initech LLC", slug: "initech" },
    ],
  });

  // Fetch tenants
  const acme = await prisma.tenant.findUnique({ where: { slug: "acme" } });
  const globex = await prisma.tenant.findUnique({ where: { slug: "globex" } });
  const initech = await prisma.tenant.findUnique({
    where: { slug: "initech" },
  });

  // Create users
  const passwordHash = await bcrypt.hash("password123", 10);
  const alice = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@acme.com",
      passwordHash,
      tenantId: acme!.id,
    },
  });
  const bob = await prisma.user.create({
    data: {
      name: "Bob",
      email: "bob@globex.com",
      passwordHash,
      tenantId: globex!.id,
    },
  });
  const carol = await prisma.user.create({
    data: {
      name: "Carol",
      email: "carol@initech.com",
      passwordHash,
      tenantId: initech!.id,
    },
  });

  // Create issues for each tenant
  await prisma.issue.createMany({
    data: [
      // Acme issues
      {
        title: "Fix login bug",
        description: "Users cannot log in.",
        status: "OPEN",
        priority: "HIGH",
        tenantId: acme!.id,
        createdById: alice.id,
      },
      {
        title: "Update docs",
        description: "Add API usage examples.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        tenantId: acme!.id,
        createdById: alice.id,
      },
      {
        title: "Refactor code",
        description: "Cleanup old modules.",
        status: "CLOSED",
        priority: "LOW",
        tenantId: acme!.id,
        createdById: alice.id,
      },
      // Globex issues
      {
        title: "Broken dashboard",
        description: "Graphs not loading.",
        status: "OPEN",
        priority: "HIGH",
        tenantId: globex!.id,
        createdById: bob.id,
      },
      {
        title: "Add dark mode",
        description: "User request.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        tenantId: globex!.id,
        createdById: bob.id,
      },
      {
        title: "Fix typo",
        description: "Typo in homepage.",
        status: "CLOSED",
        priority: "LOW",
        tenantId: globex!.id,
        createdById: bob.id,
      },
      // Initech issues
      {
        title: "Performance lag",
        description: "Slow queries.",
        status: "OPEN",
        priority: "HIGH",
        tenantId: initech!.id,
        createdById: carol.id,
      },
      {
        title: "UI polish",
        description: "Improve button styles.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        tenantId: initech!.id,
        createdById: carol.id,
      },
      {
        title: "Remove unused code",
        description: "Cleanup.",
        status: "CLOSED",
        priority: "LOW",
        tenantId: initech!.id,
        createdById: carol.id,
      },
    ],
  });

  console.log("Seed complete!");
  console.log("Test users:");
  console.log("  alice@acme.com / password123");
  console.log("  bob@globex.com / password123");
  console.log("  carol@initech.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
