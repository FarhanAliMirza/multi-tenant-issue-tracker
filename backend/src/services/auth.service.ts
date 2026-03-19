import { prisma } from "../lib/prisma";
import { comparePassword, hashPassword } from "../utils/password";
import { generateToken, type JwtPayload } from "../utils/jwt";
import type { LoginInput, RegisterInput } from "../validations/auth.schema";

type ServiceError = Error & { statusCode: number; code?: string };

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  tenantId: string;
  tenantName: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUserResponse;
}

const createServiceError = (
  message: string,
  statusCode: number,
  code?: string,
): ServiceError => {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;

  if (code) {
    error.code = code;
  }

  return error;
};

const buildJwtPayload = (params: {
  userId: string;
  tenantId: string;
  email: string;
}): JwtPayload => {
  return {
    userId: params.userId,
    tenantId: params.tenantId,
    email: params.email,
  };
};

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  try {
    const hashedPassword = await hashPassword(input.password);

    const created = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: input.tenantName,
        },
      });

      const user = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          tenantId: tenant.id,
        },
      });

      return { tenant, user };
    });

    const payload = buildJwtPayload({
      userId: created.user.id,
      tenantId: created.tenant.id,
      email: created.user.email,
    });

    const token = await generateToken(payload);

    return {
      token,
      user: {
        id: created.user.id,
        name: created.user.name,
        email: created.user.email,
        tenantId: created.tenant.id,
        tenantName: created.tenant.name,
      },
    };
  } catch (error) {
    const prismaError = error as { code?: string };

    if (prismaError.code === "P2002") {
      throw createServiceError(
        "Email is already in use",
        409,
        prismaError.code,
      );
    }

    throw error;
  }
};

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    include: {
      tenant: true,
    },
  });

  if (!user) {
    throw createServiceError("Invalid email or password", 401);
  }

  const passwordMatches = await comparePassword(input.password, user.password);

  if (!passwordMatches) {
    throw createServiceError("Invalid email or password", 401);
  }

  const token = await generateToken(
    buildJwtPayload({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
    }),
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      tenantId: user.tenantId,
      tenantName: user.tenant.name,
    },
  };
};
