"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Card } from "@heroui/react";
import {
  BookOpen,
  Truck,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Bookmark,
  Compass,
  Clock,
  PackageCheck,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserOverviewProps {
  userPayment?: any[];
  user?: any;
}

const UserOverview: React.FC<UserOverviewProps> = ({
  userPayment = [],
  user = {},
}) => {
  const paymentList = Array.isArray(userPayment) ? userPayment : [];

  // Core metrics derived from real database
  const totalBooksRead = paymentList.filter(
    (item) => item.status === "Delivered"
  ).length;

  const pendingDeliveries = paymentList.filter(
    (item) => item.status === "Pending" || item.status === "Dispatched"
  ).length;

  const totalSpent = paymentList.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  // Time-of-day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  // Reading Goal Milestone (e.g. 10 books target for current tier)
  const annualTarget = 10;
  const targetProgress = Math.min(
    100,
    Math.round((totalBooksRead / annualTarget) * 100)
  );

  // Monthly Chart Data
  const chartData = useMemo(() => {
    const monthlyMap: Record<string, number> = {};
    paymentList.forEach((item) => {
      const month = item.month || "Current";
      monthlyMap[month] = (monthlyMap[month] || 0) + (item.amount || 0);
    });

    const entries = Object.keys(monthlyMap).map((m) => ({
      name: m,
      Spent: monthlyMap[m],
    }));

    if (entries.length > 0) return entries;

    // Graceful illustrative projection if new member has no fees yet
    return [
      { name: "Jan", Spent: 0 },
      { name: "Feb", Spent: 0 },
      { name: "Mar", Spent: 0 },
      { name: "Apr", Spent: totalSpent || 0 },
    ];
  }, [paymentList, totalSpent]);

  // Recent 3 deliveries
  const recentDeliveries = useMemo(() => {
    return [...paymentList]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 3);
  }, [paymentList]);

  const statusStyles: Record<string, string> = {
    Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Dispatched: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Delivered: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className="space-y-8 text-foreground w-full select-none pb-10">
      {/* 1. SANCTUARY HERO WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/80 to-card/50 p-6 sm:p-8 backdrop-blur-xl shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="editorial-badge inline-flex items-center gap-1.5">
                <Sparkles size={12} className="text-primary" />
                Sanctuary Member Overview
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Archival Patron · Tier 1
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium tracking-tight text-foreground">
              {greeting},{" "}
              <span className="italic text-primary font-normal">
                {user?.name || "Distinguished Reader"}
              </span>
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Your personal reading sanctuary is in good standing. Track active
              physical loans, monitor courier circulations, and browse preserved
              rare collections.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link href="/books" className="flex-1 sm:flex-initial">
              <button className="btn-primary !px-5 !py-2.5 text-xs font-semibold w-full sm:w-auto inline-flex items-center justify-center gap-2 shadow-sm">
                <Compass size={14} />
                Browse Archive
              </button>
            </Link>
            <Link
              href="/dashboard/user/userDeliveryHistory"
              className="flex-1 sm:flex-initial"
            >
              <button className="btn-secondary !px-5 !py-2.5 text-xs font-semibold w-full sm:w-auto inline-flex items-center justify-center gap-2">
                <Clock size={14} />
                Track Shipments
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. ELEVATED FOUR-METRIC ANALYTICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Books Read & Goal */}
        <Card className="p-5 border border-border/70 bg-card/60 rounded-3xl shadow-sm space-y-3 hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Volumes Read
            </span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
              <BookOpen size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              {totalBooksRead}
              <span className="text-xs font-sans text-muted-foreground font-normal ml-2">
                / {annualTarget} annual goal
              </span>
            </h3>
            {/* Progress bar */}
            <div className="mt-3 space-y-1">
              <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${targetProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">
                {targetProgress}% of patron reading milestone
              </span>
            </div>
          </div>
        </Card>

        {/* Metric 2: Pending Deliveries */}
        <Card className="p-5 border border-border/70 bg-card/60 rounded-3xl shadow-sm space-y-3 hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Courier Shipments
            </span>
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
              <Truck size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              {pendingDeliveries}
            </h3>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  pendingDeliveries > 0 ? "bg-amber-500 animate-ping" : "bg-emerald-500"
                }`}
              />
              {pendingDeliveries > 0
                ? "Physical volume en route"
                : "All loan requests fulfilled"}
            </p>
          </div>
        </Card>

        {/* Metric 3: Total Spent */}
        <Card className="p-5 border border-border/70 bg-card/60 rounded-3xl shadow-sm space-y-3 hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Circulation Investment
            </span>
            <div className="p-2.5 bg-primary/10 text-primary rounded-2xl border border-primary/20">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              ${totalSpent.toFixed(2)}
            </h3>
            <p className="text-xs text-muted-foreground mt-2">
              Covers insured logistics & archival preservation
            </p>
          </div>
        </Card>

        {/* Metric 4: Sanctuary Standing */}
        <Card className="p-5 border border-border/70 bg-card/60 rounded-3xl shadow-sm space-y-3 hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sanctuary Standing
            </span>
            <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Exemplary
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium flex items-center gap-1">
              <span>✓</span> Zero overdue archival volumes
            </p>
          </div>
        </Card>
      </div>

      {/* 3. DUAL PANELS: ANALYTICS & PRIVILEGES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Recharts Fee & Activity Trends (7 Columns) */}
        <div className="lg:col-span-7 border border-border/70 bg-card/40 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif font-semibold text-lg text-foreground">
                Circulation Activity & Fee Breakdown
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monthly distribution of reading requests and insured courier fees
              </p>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-full border border-border/60">
              USD ($)
            </span>
          </div>

          <div className="w-full h-[260px] pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="rgb(var(--primary))"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="rgb(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(128,128,128,0.12)"
                />
                <XAxis
                  dataKey="name"
                  stroke="currentColor"
                  className="text-muted-foreground"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-muted-foreground"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderRadius: "14px",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                    fontSize: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
                  }}
                  formatter={(value) => [`$${value}`, "Amount"]}
                />
                <Area
                  type="monotone"
                  dataKey="Spent"
                  stroke="rgb(var(--primary))"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSpent)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Sanctuary Privileges & Benefits (5 Columns) */}
        <div className="lg:col-span-5 border border-border/70 bg-card/40 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div>
              <h4 className="font-serif font-semibold text-lg text-foreground">
                Sanctuary Privileges
              </h4>
              <p className="text-xs text-muted-foreground">
                Included with your Librello Reader Membership
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Bookmark size={16} />
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-card-soft/40 border border-border/50">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                <PackageCheck size={16} />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-foreground">
                  Insured Physical Logistics
                </h5>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                  White-glove courier packaging with return tracking slips included in every parcel.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-card-soft/40 border border-border/50">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                <BookOpen size={16} />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-foreground">
                  Rare Volume Reservations
                </h5>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                  Early 24-hour reservation access when new classical editions enter the archive.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-card-soft/40 border border-border/50">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                <TrendingUp size={16} />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-foreground">
                  Flexible Reading Extensions
                </h5>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                  Request up to 14 additional loan days through your reader portal at zero penalty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. RECENT PHYSICAL DELIVERIES QUICK FEED */}
      <div className="border border-border/70 bg-card/40 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-serif font-semibold text-lg text-foreground">
              Recent Physical Circulations
            </h4>
            <p className="text-xs text-muted-foreground">
              Latest requested shipments and archival transit status
            </p>
          </div>
          <Link
            href="/dashboard/user/userDeliveryHistory"
            className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            View Full Log <ArrowUpRight size={14} />
          </Link>
        </div>

        {recentDeliveries.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-border/70 rounded-2xl space-y-2">
            <BookOpen size={28} className="mx-auto text-muted-foreground/50" />
            <p className="text-sm font-medium text-foreground">
              No active loan records yet
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Ready to begin reading? Discover curated physical editions in the
              preservation catalog.
            </p>
            <div className="pt-2">
              <Link href="/books">
                <button className="btn-secondary !px-4 !py-2 text-xs font-semibold">
                  Browse Catalog
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {recentDeliveries.map((item, idx) => (
              <div
                key={item._id || item.transactionId || idx}
                className="py-3.5 flex flex-wrap items-center justify-between gap-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h5 className="text-sm font-serif font-semibold text-foreground">
                      {item.bookTitle || item.book?.title || "Archival Volume"}
                    </h5>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "Recent"}
                      </span>
                      <span>·</span>
                      <span>Fee: ${item.amount || 0}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                      statusStyles[item.status] ||
                      "bg-muted/40 text-muted-foreground border-border/50"
                    }`}
                  >
                    {item.status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOverview;

