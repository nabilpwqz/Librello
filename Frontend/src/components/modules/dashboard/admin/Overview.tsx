"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Truck,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  BookMarked,
  Bookmark,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminOverview = ({ stats = {} as any, booksCategories = [] as any[], admin = {} as any }: { stats?: any; booksCategories?: any[]; admin?: any }) => {

  const liveStats = {
    totalUsers: stats?.totalUsers || 0,
    totalBooks: stats?.totalBooks || 0,
    totalDeliveries: stats?.totalDeliveries || 0,
    totalRevenue: stats?.totalRevenue || 0,
  };


  const COLORS = [
    "#10b981", // Emerald
    "#3b82f6", // Blue
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#ec4899", // Pink
  ];


  const liveCategoryData = booksCategories.map((item, index) => ({
    name: item?.name || "Unknown",
    value: Number(item?.value) || 0,
    color: COLORS[index % COLORS.length],
  }));


  const liveTrendData = [
    { name: "Jan", revenue: 400 },
    { name: "Feb", revenue: 700 },
    { name: "Mar", revenue: 500 },
    { name: "Apr", revenue: 900 },
    { name: "May", revenue: liveStats.totalRevenue > 1200 ? 1100 : 800 },
    { name: "Jun", revenue: liveStats.totalRevenue },
  ];

  const statCards = [
    {
      id: "users",
      title: "Total Users",
      value: liveStats.totalUsers,
      change: "+15%",
      icon: <Users size={20} />,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      id: "books",
      title: "Total Books",
      value: liveStats.totalBooks,
      change: "Steady",
      icon: <BookOpen size={20} />,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "deliveries",
      title: "Total Deliveries",
      value: liveStats.totalDeliveries,
      change: "Active",
      icon: <Truck size={20} />,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "revenue",
      title: "Total Revenue",
      value: `${liveStats.totalRevenue} $`,
      change: "+22%",
      icon: <DollarSign size={20} />,
      color: "text-red-500 bg-red-500/10 border-red-500/20",
    },
  ];

  return (
    <div className="space-y-8 font-urbanist p-4 md:p-6 text-foreground bg-background/40 w-full">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold font-serif tracking-tight flex flex-wrap items-center gap-2 capitalize text-foreground">
            <span className="text-primary font-bold">
              {admin?.name || "Admin"}
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
            Platform-wide insights and transactional analytics dashboard.
          </p>
        </div>

        {/*  Top bookmark decoration banner */}
        <div className="absolute top-0 right-12 w-8 h-16 bg-primary/20 border-x border-b border-primary/30 rounded-b-xl flex items-end justify-center pb-2 text-primary">
          <Bookmark size={14} className="fill-current" />
        </div>
      </div>

      {/* Stats Cards Dashboard */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-base font-bold font-poppins tracking-tight">
          Quick Stats Dashboard
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="p-5 rounded-2xl border border-border bg-card/60 shadow-sm flex items-center justify-between group hover:border-border/80 transition-colors"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  {card.title}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black font-poppins tracking-tight">
                    {card.value}
                  </span>
                  {card.change !== "Steady" && card.change !== "Active" && (
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <ArrowUpRight size={10} /> {card.change}
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${card.color}`}
              >
                {card.icon}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Charts Visualization Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-time Line/Area Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 p-6 border border-border bg-card/40 backdrop-blur-md rounded-3xl space-y-4 min-w-0"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg sm:text-base font-bold font-poppins tracking-tight">
              Growth & Revenue Dynamic
            </h3>
            <span className="text-base sm:text-sm font-semibold text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />{" "}
              Live System Monitor
            </span>
          </div>

          {/* area chart  */}
          <div className="h-64 md:h-72 w-full min-w-0 text-base sm:text-sm">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={liveTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="currentColor"
                  className="text-muted-foreground/40"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-muted-foreground/40"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    borderRadius: "12px",
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Total Revenue ($)"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Dynamic Category Donut Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 p-6 border border-border bg-card/40 backdrop-blur-md rounded-3xl flex flex-col justify-between space-y-4 min-w-0"
        >
          <h3 className="text-lg sm:text-base font-bold font-poppins tracking-tight">
            Books by Category
          </h3>

          {liveCategoryData.length === 0 ? (
            <div className="text-center py-10 text-base sm:text-sm text-muted-foreground italic">
              No categories found in database.
            </div>
          ) : (
            <>
              {/*   */}
              <div className="h-44 w-full min-w-0 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={liveCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {liveCategoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          className="focus:outline-none"
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-black font-poppins">
                    {liveStats.totalBooks}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                    Total
                  </span>
                </div>
              </div>

              {/* Live Database Legend List */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/30 max-h-[100px] overflow-y-auto scrollbar-none">
                {liveCategoryData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-1.5 text-[11px] font-medium"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground truncate">
                      {item.name}{" "}
                      <span className="text-foreground font-bold">
                        (
                        {liveStats.totalBooks > 0
                          ? Math.round(
                            (item.value / liveStats.totalBooks) * 100,
                          )
                          : 0}
                        %)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Mini Featured Catalog UI Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 border border-border bg-card/40 backdrop-blur-md rounded-3xl space-y-4"
      >
        <h3 className="text-lg sm:text-base font-bold font-poppins tracking-tight flex items-center gap-2">
          <BookMarked size={18} className="text-primary" /> Mini-list of
          Featured Books
          <span className="text-[10px] font-normal text-muted-foreground uppercase tracking-widest">
            (Platform Catalog)
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Advanced Next.js Architecture", author: "Vercel Core" },
            { title: "Mastering Tailwind CSS", author: "Adam Wathan" },
            { title: "Node.js Complete Guide", author: "Ryan Dahl" },
          ].map((book, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card-soft/20 hover:bg-card-soft/40 transition-colors"
            >
              <span className="font-poppins font-black text-lg sm:text-base text-muted-foreground/50 w-4">
                {i + 1}
              </span>
              <div className="overflow-hidden flex-1">
                <h4 className="text-base sm:text-sm font-bold font-poppins truncate text-foreground">
                  {book.title}
                </h4>
                <p className="text-[11px] text-muted-foreground truncate">
                  by {book.author}
                </p>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md mt-1 inline-block font-poppins">
                  System Synchronized
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOverview;
