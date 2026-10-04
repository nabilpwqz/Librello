"use client";

import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { BookOpen, DollarSign, Clock, TrendingUp } from "lucide-react";

export default function LibrarianOverview({
  books = [] as any[],
  payments = [] as any[],
  librarian = {} as any,
}: {
  books?: any[];
  payments?: any[];
  librarian?: any;
}) {
  console.log(books, "books");


  const totalBooksCount = books.length;
  const totalEarnings = payments.reduce(
    (sum, item) => sum + (Number(item?.amount) || 0),
    0,
  );
  const activePendingCount = payments.filter(
    (item) => item?.status === "Pending",
  ).length;

  const stats = [
    {
      title: "Total Books Listed",
      value: totalBooksCount,
      icon: BookOpen,
      desc: "Live collection from inventory",
    },
    {
      title: "Total Earnings",
      value: `$${totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      desc: "Aggregated gross delivery revenues",
    },
    {
      title: "Active Pending Requests",
      value: activePendingCount,
      icon: Clock,
      desc: "Requires immediate action",
    },
  ];


  const mostRequestedBooks = [...books]
    .filter((book) => book?.requests !== undefined)
    .sort((a, b) => (Number(b.requests) || 0) - (Number(a.requests) || 0))
    .slice(0, 3)
    .map((book) => ({
      id: book._id,
      title: book.title || "Untitled Book",
      image:
        book.cover ||
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
      requests: book.requests || 0,
    }));

  return (
    <div className="space-y-8 pt-4 font-urbanist text-foreground ">
      <div className=" pl-3">
        <h2 className="text-xl md:text-2xl font-semibold font-serif tracking-tight flex flex-wrap items-center gap-2 capitalize text-foreground ">
          <span className="text-primary font-bold">
            {librarian?.name || "Librarian"}
          </span>
          <span className="text-muted-foreground font-medium text-lg md:text-xl">
            : Overview Diagnostics
          </span>
          <TrendingUp
            size={22}
            className="text-primary flex-shrink-0 animate-pulse"
          />
        </h2>
        <p className="text-lg sm:text-base text-muted-foreground">
          Monitor your inventory, delivery requests, and earnings in one place.
        </p>
      </div>

      {/* =========================================
            QUICK STATS CARDS SECTION
      ========================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="dashboard-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg sm:text-base font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold mt-2 font-poppins text-foreground">
                    {stat.value}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Icon size={24} />
                </div>
              </div>
              <p className="text-base sm:text-sm text-muted-foreground mt-4 flex items-center gap-1">
                <TrendingUp size={14} className="text-primary" />
                {stat.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* =========================================
            CHARTS VISUALIZATION SECTION
      ========================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* */}
        <div className="dashboard-card lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold font-poppins text-foreground">
              Earnings Analytics
            </h3>
            <p className="text-lg sm:text-base text-muted-foreground mb-6">
              Monthly revenue generation overview
            </p>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={payments}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="rgb(var(--primary))"
                      stopOpacity={0.3}
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
                  stroke="rgba(var(--border), 0.3)"
                />
                <XAxis
                  dataKey="month"
                  stroke="rgb(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="rgb(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgb(var(--card))",
                    borderColor: "rgb(var(--border))",
                    borderRadius: "16px",
                    color: "rgb(var(--foreground))",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="rgb(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrimary)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MINI-LIST: MOST REQUESTED BOOKS */}
        <div className="dashboard-card flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold font-poppins text-foreground">
              Most Requested
            </h3>
            <p className="text-lg sm:text-base text-muted-foreground mb-6">
              Your top performing book listings
            </p>
          </div>

          <div className="space-y-4 flex-1">
            {mostRequestedBooks.length === 0 ? (
              <p className="text-base sm:text-sm text-muted-foreground italic text-center pt-8">
                No book orders requested yet.
              </p>
            ) : (
              mostRequestedBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-card-soft/50 border border-border/40 hover:border-primary/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={book.image}
                      alt="book image"
                      className="w-11 h-11 flex-shrink-0 rounded-sm object-cover"
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-semibold text-foreground text-lg sm:text-base truncate font-poppins">
                        {book.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-tight font-bold">
                        Live Tracking
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 pl-2">
                    <span className="text-base sm:text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {book.requests} reqs
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
