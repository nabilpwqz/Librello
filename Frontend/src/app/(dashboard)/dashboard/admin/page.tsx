import React from "react";
import Link from "next/link";
import { getUserSession } from "@/lib/core/session";

const AdminHomePage = async () => {
  const admin = await getUserSession();

  return (
    <div className="w-full min-h-[100vh] flex items-center justify-center p-4 font-sans text-foreground bg-background">
      <div className="max-w-xl w-full border border-border bg-card/60 rounded-2xl p-8 md:p-10 shadow-sm text-center space-y-5 relative overflow-hidden backdrop-blur-md">
        {/* Shield icon */}
        <div className="flex justify-center pt-2">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center text-primary relative">
            {admin?.image ? (
              <img
                src={admin.image}
                alt="admin avatar"
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            )}

            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-background z-10" />
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <p className="text-3xl md:text-4xl font-semibold tracking-tight leading-none italic font-serif text-foreground mb-2">
            Welcome back, <br />
            <span className="text-primary italic font-serif">
              {admin?.name || "Administrator"}
            </span>
          </p>

          <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
            Platform Operations & Governance
          </p>
        </div>

        {/* Email badge */}
        <div className="inline-flex items-center gap-2 bg-card-soft border border-border rounded-full px-4 py-1.5 mx-auto max-w-full">
          <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-muted-foreground font-medium truncate max-w-[220px]">
            {admin?.email || "admin@librello.com"}
          </span>
        </div>

        {/* Meta Grid */}
        <div className="pt-4 border-t border-border grid grid-cols-2 gap-4 text-left max-w-xs mx-auto">
          <div className="flex items-center gap-2.5 text-muted-foreground bg-card-soft p-2.5 rounded-xl border border-border">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="overflow-hidden">
              <span className="block text-[9px] uppercase font-bold tracking-wider opacity-60">
                System
              </span>
              <span className="block text-xs font-bold text-foreground truncate">
                Operational
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-muted-foreground bg-card-soft p-2.5 rounded-xl border border-border">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="overflow-hidden">
              <span className="block text-[9px] uppercase font-bold tracking-wider opacity-60">
                Level
              </span>
              <span className="block text-xs font-bold text-primary truncate capitalize">
                Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Action Link */}
        <div className="pt-2">
          <Link
            href="/dashboard/admin/overview"
            className="btn-primary inline-flex text-xs uppercase tracking-wider py-3 px-6 rounded-xl font-bold"
          >
            System Metrics Overview
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
