import React from "react";
import { getUserSession } from "@/lib/core/session";

const UserDashboardHomePage = async () => {
  const user = await getUserSession();

  return (
    <div className="w-full min-h-[100vh] flex items-center justify-center p-4 font-sans bg-background">
      <div className="max-w-xl w-full border border-border bg-card/60 rounded-2xl p-8 md:p-12 shadow-sm text-center space-y-6 relative overflow-hidden backdrop-blur-md">
        {/* User avatar or monograph */}
        <div className="flex justify-center pt-2">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center text-primary relative">
            {user?.image ? (
              <img
                src={user.image}
                alt="user avatar"
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            )}

            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-background z-10" />
          </div>
        </div>

        {/* Dynamic greeting */}
        <div className="space-y-2">
          <p className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight italic font-serif text-foreground">
            Welcome back, <br />
            <span className="text-primary italic font-serif">
              {user?.name || "Reader"}
            </span>
          </p>

          <p className="text-xs text-primary font-bold uppercase tracking-widest">
            Personal Reading Dashboard
          </p>
        </div>

        {/* Email badge */}
        <div className="inline-flex items-center gap-2 bg-card-soft border border-border rounded-full px-4 py-1.5 mx-auto max-w-full">
          <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-muted-foreground font-medium truncate max-w-[220px]">
            {user?.email || "reader@librello.com"}
          </span>
        </div>

        {/* Literary quotation */}
        <div className="bg-card-soft/50 border border-border rounded-xl p-4 max-w-sm mx-auto">
          <p className="text-sm italic font-serif text-muted-foreground leading-relaxed">
            &ldquo;A reader lives a thousand lives before he dies.&rdquo;
          </p>
        </div>

        {/* Meta Grid */}
        <div className="pt-6 border-t border-border grid grid-cols-2 gap-4 text-left max-w-xs mx-auto">
          <div className="flex items-center gap-2.5 text-muted-foreground bg-card-soft p-2.5 rounded-xl border border-border">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="overflow-hidden">
              <span className="block text-[9px] uppercase font-bold tracking-wider opacity-60">
                Status
              </span>
              <span className="block text-xs font-bold text-foreground truncate">
                Active Member
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-muted-foreground bg-card-soft p-2.5 rounded-xl border border-border">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="overflow-hidden">
              <span className="block text-[9px] uppercase font-bold tracking-wider opacity-60">
                Role
              </span>
              <span className="block text-xs font-bold text-primary truncate capitalize">
                {user?.role || "Reader"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardHomePage;
