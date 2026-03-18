import jwt, { type SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  tenantId: string;
  email: string;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
};

const getJwtExpiresIn = (): SignOptions["expiresIn"] => {
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!expiresIn) {
    throw new Error("JWT_EXPIRES_IN is not configured");
  }

  if (/^\d+$/.test(expiresIn)) {
    return Number(expiresIn);
  }

  return expiresIn as SignOptions["expiresIn"];
};

const isJwtPayload = (value: unknown): value is JwtPayload => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.userId === "string" &&
    typeof payload.tenantId === "string" &&
    typeof payload.email === "string"
  );
};

export const generateToken = async (payload: JwtPayload): Promise<string> => {
  return await new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      getJwtSecret(),
      { expiresIn: getJwtExpiresIn() },
      (error, token) => {
        if (error || !token) {
          reject(error ?? new Error("Failed to generate JWT"));
          return;
        }

        resolve(token);
      },
    );
  });
};

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  const decoded = await new Promise<unknown>((resolve, reject) => {
    jwt.verify(token, getJwtSecret(), (error, payload) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(payload);
    });
  });

  if (!isJwtPayload(decoded)) {
    throw new Error("Invalid JWT payload");
  }

  return decoded;
};