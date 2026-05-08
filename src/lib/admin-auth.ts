import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const sessionCookieName = "tiramisu-admin-session";
const sessionMaxAge = 60 * 60 * 24 * 7;

type SessionPayload = {
  username: string;
  expiresAt: number;
};

type AdminConfig = {
  username: string;
  password: string;
  sessionSecret: string;
};

export type AdminSession = {
  configured: boolean;
  authenticated: boolean;
  username: string | null;
};

function getAdminConfig(): AdminConfig | null {
  const password = process.env.ADMIN_PASSWORD?.trim();
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim();
  const username = process.env.ADMIN_USERNAME?.trim() || "admin";

  if (!password || !sessionSecret) {
    return null;
  }

  return {
    username,
    password,
    sessionSecret,
  };
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signValue(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function encodePayload(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(value: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as Partial<SessionPayload>;

    if (
      typeof parsed.username !== "string" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }

    return {
      username: parsed.username,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

function createSessionToken(config: AdminConfig) {
  const payload = encodePayload({
    username: config.username,
    expiresAt: Date.now() + sessionMaxAge * 1000,
  });

  return `${payload}.${signValue(payload, config.sessionSecret)}`;
}

function parseSessionToken(token: string, config: AdminConfig) {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signValue(payload, config.sessionSecret);
  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  const decoded = decodePayload(payload);
  if (!decoded || decoded.expiresAt < Date.now()) {
    return null;
  }

  return decoded;
}

export function isAdminConfigured() {
  return getAdminConfig() !== null;
}

export async function getAdminSession(): Promise<AdminSession> {
  const config = getAdminConfig();
  if (!config) {
    return {
      configured: false,
      authenticated: false,
      username: null,
    };
  }

  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) {
    return {
      configured: true,
      authenticated: false,
      username: null,
    };
  }

  const payload = parseSessionToken(token, config);
  if (!payload) {
    return {
      configured: true,
      authenticated: false,
      username: null,
    };
  }

  return {
    configured: true,
    authenticated: true,
    username: payload.username,
  };
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session.configured || !session.authenticated) {
    redirect("/studio/login");
  }

  return session;
}

export async function verifyAdminCredentials(username: string, password: string) {
  const config = getAdminConfig();
  if (!config) {
    return {
      ok: false,
      reason: "missing-config" as const,
    };
  }

  const usernameOk = safeCompare(username, config.username);
  const passwordOk = safeCompare(password, config.password);

  return {
    ok: usernameOk && passwordOk,
    reason: usernameOk && passwordOk ? null : ("invalid-credentials" as const),
  };
}

export async function establishAdminSession() {
  const config = getAdminConfig();
  if (!config) {
    return false;
  }

  (await cookies()).set(sessionCookieName, createSessionToken(config), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionMaxAge,
    path: "/",
  });

  return true;
}

export async function clearAdminSession() {
  (await cookies()).delete(sessionCookieName);
}
