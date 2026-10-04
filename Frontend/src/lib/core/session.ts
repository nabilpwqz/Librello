"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User, UserRole } from "@/types";

export const getUserSession = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("librello_session")?.value;
    if (!sessionCookie) return null;
    return JSON.parse(sessionCookie) as User;
  } catch {
    return null;
  }
};

// get user token
export const getUserToken = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("librello_token")?.value;
    return tokenCookie || null;
  } catch {
    return null;
  }
};

// required role
export const requireRole = async (role: UserRole): Promise<User> => {
  const user = await getUserSession();
  if (!user) {
    redirect("/signin");
  }
  if (user.role !== role) {
    redirect("/unauthorized");
  }
  return user;
};
