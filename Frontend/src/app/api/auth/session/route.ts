import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("librello_session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ user: null });
  }
  try {
    const user = JSON.parse(sessionCookie);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user, token } = body;

    let finalUser = user;

    if (user) {
      const backendUrl = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "");
      try {
        const syncRes = await fetch(`${backendUrl}/api/users/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user }),
          signal: AbortSignal.timeout(800),
        });
        if (syncRes.ok) {
          const syncData = await syncRes.json();
          if (syncData.user) {
            finalUser = {
              ...user,
              role: syncData.user.role || user.role,
              _id: syncData.user._id || user.id,
            };
          }
        }
      } catch (syncErr) {
        // Fallback to client user state immediately if backend is slow/offline
      }
    }

    const res = NextResponse.json({ success: true, user: finalUser });
    if (finalUser) {
      res.cookies.set("librello_session", JSON.stringify(finalUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      if (token) {
        res.cookies.set("librello_token", token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    } else {
      res.cookies.delete("librello_session");
      res.cookies.delete("librello_token");
    }
    return res;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("librello_session");
  res.cookies.delete("librello_token");
  return res;
}
