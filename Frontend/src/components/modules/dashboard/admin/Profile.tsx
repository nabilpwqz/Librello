"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation"; //  For real-time router data synchronization
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  BookOpen,
  DollarSign,
  Clock,
  TrendingUp,
  Camera,
  MapPin,
  Calendar,
  Briefcase,
  Plus,
  Loader2, //  Loading spinner asset token
  Edit2, //  Icon token for trigger name inline editor
  Check, //  Sync approval check token
  X, //  Abort action token
  ShieldAlert,
} from "lucide-react";
import { Avatar } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

// Premium color tokens catalog for chart visualization
const PIE_COLORS = [
  "#4F46E5",
  "#0EA5E9",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#8B5CF6",
];

const AdminProfile = ({
  allUsers = [],
  allBooks = [],
  allTransactions = [],
}) => {
  const { theme } = useTheme();
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const activeUser = session?.user;

  // Image upload tracking states & inline name editor states
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  // ========================================================
  //  Core Database Pipelines & Matrix Calculations (Dynamic)
  // ========================================================
  const totalUsers = allUsers?.length || 0;
  const totalBooks = allBooks?.length || 0;
  const totalDeliveries =
    allTransactions.filter((item) => item.status === "Delivered").length || 0;

  const totalRevenue = useMemo(() => {
    return allTransactions.reduce(
      (sum, item) => sum + (item?.amount || item?.fee || 0),
      0,
    );
  }, [allTransactions]);

  //  Mapping Real Database Data Stream for Revenue Graph Matrix
  const chartAnalyticsData = useMemo(() => {
    const groupedMonths = allTransactions.reduce((acc, item) => {
      const monthName = item?.month || "Jun";
      acc[monthName] = (acc[monthName] || 0) + (item?.amount || item?.fee || 0);
      return acc;
    }, {});

    return Object.keys(groupedMonths).map((month) => ({
      name: month,
      revenue: groupedMonths[month],
    }));
  }, [allTransactions]);

  //  Trigger function to toggle name edit mode matrix input
  const startEditName = () => {
    setUpdatedName(activeUser?.name || "Admin Name");
    setIsEditingName(true);
  };

  //  Direct core Better Auth pipeline handler for synchronizing name configurations
  const handleSaveName = async () => {
    if (!updatedName.trim()) return toast.error("Name cannot be empty! ");
    if (updatedName === activeUser?.name) return setIsEditingName(false);

    setIsSavingName(true);
    const toastId = toast.loading(
      "Updating administrative profile configurations... ⏳",
    );

    try {
      const result = await authClient.updateUser({
        name: updatedName.trim(),
        image: activeUser?.image,
      });

      if (result?.data) {
        toast.update(toastId, {
          render: "Administrative mainframe name updated! ",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setIsEditingName(false);
        router.refresh();
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to update admin name! ",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsSavingName(false);
    }
  };

  // Direct client-side asset stream upload via ImgBB API
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select a valid image file! ");
    }

    setIsUpdatingAvatar(true);
    const toastId = toast.loading("Uploading new root avatar to imgBB...");

    const imgBBFormData = new FormData();
    imgBBFormData.append("image", file);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: imgBBFormData,
        },
      );
      const data = await response.json();

      if (data.success) {
        const result = await authClient.updateUser({
          image: data.data.url,
          name: activeUser?.name,
        });

        if (result?.data) {
          toast.update(toastId, {
            render: "Root avatar synchronized successfully! ",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
          router.refresh();
        }
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Avatar upload failed! ",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const stats = [
    {
      title: "Total Users Cluster",
      value: totalUsers,
      icon: BookOpen,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Gross Platform Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "System Deliveries",
      value: totalDeliveries,
      icon: Clock,
      color: "bg-amber-500/10 text-amber-500",
    },
  ];

  return (
    <div className="w-full font-urbanist text-foreground min-h-screen pb-12">
      {/* =========================================
            (COVER & AVATAR BANNER)
      ========================================= */}
      <div className="relative rounded-b-3xl border-b border-border bg-card shadow-sm overflow-hidden">
        {/* Profile Cover Image Layout */}
        <div className="h-48 md:h-64 w-full bg-gradient-to-r from-primary/40 via-secondary/20 to-primary/40 relative">
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200"
            alt="Admin Cover"
            className="w-full h-full object-cover opacity-80"
          />
          <button className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white text-base sm:text-sm px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer">
            <Camera size={14} /> Edit System Banner
          </button>
        </div>

        {/* Profile Avatar Shell Frame */}
        <div className="max-w-6xl mx-auto px-4 pb-6 relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20">
          {/* Root Profile Avatar Wrapper */}
          <div className="relative z-10">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 rounded-full p-20 ring-4 ring-card bg-card shadow-xl text-3xl font-bold font-poppins relative overflow-hidden group">
              <Avatar.Image
                alt={activeUser?.name || "Admin"}
                src={
                  activeUser?.image ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                }
                referrerPolicy="no-referrer"
              />
              <Avatar.Fallback>A</Avatar.Fallback>

              {/* Dynamic full-screen blur loader on active binary upload */}
              {isUpdatingAvatar && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-primary z-20">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              )}
            </Avatar>

            {/* Programmatic label button triggering hidden file binary input stream */}
            <label className="absolute bottom-2 right-2 bg-primary text-background p-2 rounded-full shadow-lg hover:opacity-90 transition-all cursor-pointer border-2 border-card flex items-center justify-center select-none">
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isUpdatingAvatar}
                className="hidden"
              />
            </label>
          </div>

          {/* Name & metadata bio layout blocks */}
          <div className="flex-1 text-center md:text-left md:pt-10 mt-12">
            {/* Dynamic UI switching layout tracking name mutations inline */}
            <div className="flex items-center justify-center md:justify-start gap-3 h-10">
              {isEditingName ? (
                <div className="flex items-center gap-2 bg-card border border-border px-2 py-1 rounded-xl shadow-sm max-w-xs w-full">
                  <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    disabled={isSavingName}
                    className="bg-transparent text-lg sm:text-base font-bold font-poppins w-full focus:outline-none px-1 text-foreground"
                    placeholder="Enter admin name"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isSavingName}
                    className="p-1 text-emerald-500 cursor-pointer"
                  >
                    {isSavingName ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    disabled={isSavingName}
                    className="p-1 text-red-500 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <h1 className="text-2xl md:text-3xl font-bold font-poppins text-foreground flex items-center justify-center md:justify-start gap-2 group">
                  {activeUser?.name || "System Admin"}
                  <button
                    onClick={startEditName}
                    className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-primary opacity-60 group-hover:opacity-100 transition-all cursor-pointer flex items-center justify-center"
                    title="Edit Name"
                  >
                    <Edit2 size={16} />
                  </button>
                  <span className="text-base sm:text-sm bg-primary/20 text-primary font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider h-5 flex items-center font-urbanist">
                    {activeUser?.role || "Admin"}
                  </span>
                </h1>
              )}
            </div>
            <p className="text-lg sm:text-base text-muted-foreground mt-2 font-medium">
              Ecosystem Director | Overseeing dynamic platform matrix core
              infrastructure.
            </p>

            {/* Operational framework descriptive meta tags */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-base sm:text-sm text-muted-foreground font-semibold">
              <span className="flex items-center gap-1">
                <ShieldAlert size={14} /> Mainframe Root
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} /> Global Node
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> Active Session: 2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
            TIMELINE LAYOUT (LEFT INTRO & RIGHT STATS)
      ========================================= */}
      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ⬅ Left Grid Column: System Analytics Info Box */}
        <div className="space-y-6">
          <div className="dashboard-card">
            <h3 className="text-lg font-bold font-poppins mb-3">
              System Framework
            </h3>
            <div className="space-y-4 text-lg sm:text-base text-foreground/90 font-medium">
              <p className="text-center text-muted-foreground text-base sm:text-sm italic border-b border-border/40 pb-3">
                "Data security is the core engine of clean web architecture."
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Email:</span>
                <span className="truncate">
                  {activeUser?.email || "admin@librello.com"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Status:</span>
                <span>
                  Clearance State:{" "}
                  <span className="text-primary font-bold">
                    Root Verified
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Core Counts Grid */}
          <div className="dashboard-card">
            <h3 className="text-lg font-bold font-poppins mb-3">
              Quick Metrics
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-card-soft/60 rounded-xl border border-border/40">
                <span className="block text-xl font-bold text-primary font-poppins">
                  {totalUsers}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                  Users
                </span>
              </div>
              <div className="p-3 bg-card-soft/60 rounded-xl border border-border/40">
                <span className="block text-xl font-bold text-primary font-poppins">
                  {totalBooks}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                  Books
                </span>
              </div>
              <div className="p-3 bg-card-soft/60 rounded-xl border border-border/40">
                <span className="block text-xl font-bold text-primary font-poppins">
                  {totalDeliveries}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                  Orders
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Grid Column: Charts & Dynamic Matrix Data Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Metrics Multi-stats Metric Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="dashboard-card !p-4 flex items-center gap-4"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block truncate">
                      {stat.title}
                    </span>
                    <span className="text-xl font-bold font-poppins text-foreground block mt-0.5">
                      {stat.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Recharts Area Engine Box Monitoring Platform Capital Outflows */}
          <div className="dashboard-card">
            <div className="pb-4 border-b border-border/50 mb-6">
              <h3 className="text-xl font-bold font-poppins text-foreground">
                Performance Insights
              </h3>
              <p className="text-base sm:text-sm text-muted-foreground mt-0.5">
                Global operational platform revenue flow chart metrics feed
              </p>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartAnalyticsData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="facebookPrimary"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
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
                    dataKey="name"
                    stroke="rgb(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="rgb(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
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
                    dataKey="revenue"
                    stroke="rgb(var(--primary))"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#facebookPrimary)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-1 text-base sm:text-sm text-muted-foreground font-semibold">
              <TrendingUp size={14} className="text-primary" />
              <span>Ecosystem global financial synchronization active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
