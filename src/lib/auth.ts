import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { UserRole } from "@prisma/client";

const secretKey = process.env.JWT_SECRET || "fallback-secret";
const key = new TextEncoder().encode(secretKey);

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function verifyToken(input: string) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionUser;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sporthub-token")?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch (error) {
    return null;
  }
}

export async function setSession(user: SessionUser) {
  const token = await signToken(user);
  const cookieStore = await cookies();
  cookieStore.set("sporthub-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("sporthub-token");
}
