"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
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
  Loader2, //  লোডিং স্পিনারের জন্য
  Edit2,
  Check,
  X,
} from "lucide-react";
import { Avatar } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const LibrarianProfile = ({ earnings = [], myBooks = [] }) => {
  const { theme } = useTheme();
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const activeUser = session?.user;

  // image upload state
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  // ========================================================
  // matrix calculations
  // ========================================================
  const totalBooksListed = myBooks?.length || 0;

  const totalEarnings = useMemo(() => {
    return earnings.reduce((sum, item) => sum + (item?.amount || 0), 0);
  }, [earnings]);

  const activePendingRequests = useMemo(() => {
    return earnings.filter(
      (item) => item?.status === "Pending" || item?.status === "Dispatched",
    ).length;
  }, [earnings]);

  //   'month' ও 'amount'
  const chartAnalyticsData = useMemo(() => {
    const groupedMonths = earnings.reduce((acc, item) => {
      const monthName = item?.month || "Unknown";
      acc[monthName] = (acc[monthName] || 0) + (item?.amount || 0);
      return acc;
    }, {});

    // অবজেক্ট কি (Keys) থেকে Recharts ফ্রেন্ডলি অ্যারে ফরম্যাট জেনারেট
    return Object.keys(groupedMonths).map((month) => ({
      name: month,
      earnings: groupedMonths[month],
    }));
  }, [earnings]);

  // Name edit krar function
  const startEditName = () => {
    setUpdatedName(activeUser?.name || "Librarian Name");
    setIsEditingName(true);
  };

  //  নতুন নাম ডাটাবেজে সেভ করার কোর Better Auth ফাংশন
  const handleSaveName = async () => {
    if (!updatedName.trim()) {
      return toast.error("Name cannot be empty! ");
    }
    if (updatedName === activeUser?.name) {
      setIsEditingName(false);
      return;
    }

    setIsSavingName(true);
    const toastId = toast.loading("Updating librarian profile parameters... ");

    try {
      const result = await authClient.updateUser({
        name: updatedName.trim(),
        image: activeUser?.image,
      });

      if (result?.data) {
        toast.update(toastId, {
          render: "Librarian display name updated! ",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setIsEditingName(false);
        router.refresh();
      }

      if (result?.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Failed to update name! ",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsSavingName(false);
    }
  };

  //  image upload handler imgBB
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select a valid image file! ");
    }

    setIsUpdatingAvatar(true);
    const toastId = toast.loading(
      "Uploading new avatar profile matrix to imgBB... ⏳",
    );

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
        const secureImageUrl = data.data.url;

        const result = await authClient.updateUser({
          image: secureImageUrl,
          name: activeUser?.name,
        });

        if (result?.data) {
          toast.update(toastId, {
            render: "Librarian avatar updated successfully! ",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
          router.refresh();
        }

        if (result?.error) {
          throw new Error(result.error.message);
        }
      } else {
        throw new Error("imgBB response failure");
      }
    } catch (error) {
      console.error("Avatar sync exception:", error);
      toast.update(toastId, {
        render: error.message || "Failed to update profile avatar! ",
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
      title: "Total Books Listed",
      value: totalBooksListed,
      icon: BookOpen,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Total Earnings",
      value: `$${totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Active Pending Requests",
      value: activePendingRequests,
      icon: Clock,
      color: "bg-amber-500/10 text-amber-500",
    },
  ];

  return (
    <div className="w-full font-urbanist text-foreground min-h-screen pb-12">
      {/* =========================================
            (COVER & AVATAR)
      ========================================= */}
      <div className="relative rounded-b-3xl border-b border-border bg-card shadow-sm overflow-hidden">
        {/* cover image */}
        <div className="h-48 md:h-64 w-full bg-gradient-to-r from-primary/40 via-secondary/20 to-primary/40 relative">
          <img
            src="https://i.ibb.co/3mKH0XrZ/slider3.jpg"
            alt="Library Cover"
            className="w-full h-full object-cover opacity-80"
          />
          <button className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white text-base sm:text-sm px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer">
            <Camera size={14} /> Edit Cover Photo
          </button>
        </div>

        {/* Profile section */}
        <div className="max-w-6xl mx-auto px-4 pb-6 relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20">
          {/* profile image */}
          <div className="relative z-10">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 rounded-full p-20 ring-4 ring-card bg-card shadow-xl text-3xl font-bold font-poppins relative overflow-hidden group">
              <Avatar.Image
                alt={activeUser?.name || "Librarian"}
                src={
                  activeUser?.image ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                }
                referrerPolicy="no-referrer"
              />
              <Avatar.Fallback>
                {activeUser?.name
                  ? activeUser.name.charAt(0).toUpperCase()
                  : "L"}
              </Avatar.Fallback>

              {/* লাইভ ফাইল লোডার ওভারলে ইফেক্ট */}
              {isUpdatingAvatar && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-primary z-20">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              )}
            </Avatar>

            {/* image upload button */}
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

          {/* Name & bio*/}
          <div className="flex-1 text-center md:text-left md:pt-10 mt-12">
            {/* ডায়নামিক নাম এবং ইনপুট ফিল্ড সুইচিং কন্ডিশন */}
            <div className="flex items-center justify-center md:justify-start gap-3 h-10">
              {isEditingName ? (
                <div className="flex items-center gap-2 bg-card border border-border px-2 py-1 rounded-xl shadow-sm max-w-xs w-full">
                  <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    disabled={isSavingName}
                    className="bg-transparent text-lg sm:text-base font-bold font-poppins w-full focus:outline-none px-1 text-foreground"
                    placeholder="Enter full name"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isSavingName}
                    className="p-1 hover:bg-emerald-500/10 rounded-md text-emerald-500 transition-colors cursor-pointer disabled:opacity-40"
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
                    className="p-1 hover:bg-red-500/10 rounded-md text-red-500 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <h1 className="text-2xl md:text-3xl font-extrabold font-poppins text-foreground flex items-center justify-center md:justify-start gap-2 group">
                  {activeUser?.name || "Librarian Name"}
                  <button
                    onClick={startEditName}
                    className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-primary opacity-60 group-hover:opacity-100 transition-all cursor-pointer flex items-center justify-center"
                    title="Edit Name"
                  >
                    <Edit2 size={16} />
                  </button>
                  <span className="text-base sm:text-sm bg-primary/20 text-primary font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider h-5 flex items-center font-urbanist">
                    {activeUser?.role || "Librarian"}
                  </span>
                </h1>
              )}
            </div>

            <p className="text-lg sm:text-base text-muted-foreground mt-2 font-medium">
              Managing knowledge, one doorstep at a time.
            </p>

            {/* ইন্ট্রো মেটা ট্যাগ */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-base sm:text-sm text-muted-foreground font-semibold">
              <span className="flex items-center gap-1">
                <Briefcase size={14} /> Official Curator
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} /> Bloomsbury Archive Guild
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> Joined 2026
              </span>
            </div>
          </div>

          {/* action button*/}
          <div className="flex gap-2 mt-4 md:mt-0 flex-shrink-0">
            <Link
              href="/dashboard/librarian/addBook"
              className="btn-primary !px-4 !py-2 text-sm flex items-center gap-1.5"
            >
              <Plus size={16} /> Catalog New Edition
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================
            TIMELINE LAYOUT (LEFT INTRO & RIGHT STATS)
      ========================================= */}
      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* left side  Intro/About Box */}
        <div className="space-y-6">
          <div className="dashboard-card">
            <h3 className="text-lg font-bold font-poppins mb-3">Intro</h3>
            <div className="space-y-4 text-lg sm:text-base text-foreground/90 font-medium">
              <p className="text-center text-muted-foreground text-base sm:text-sm italic border-b border-border/40 pb-3">
                "Books are a uniquely portable magic." (Stephen King)
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Email:</span>
                <span className="truncate">
                  {activeUser?.email || "curator@librello.com"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Status:</span>
                <span>
                  Active Status:{" "}
                  <span className="text-primary font-bold">Verified Curator</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Security:</span>
                <span>
                  Clearance Token:{" "}
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border">
                    JWT Active
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="dashboard-card">
            <h3 className="text-lg font-bold font-poppins mb-3">
              Quick Metrics
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-card-soft/60 rounded-xl border border-border/40">
                <span className="block text-xl font-bold text-primary font-poppins">
                  {totalBooksListed}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                  Books
                </span>
              </div>
              <div className="p-3 bg-card-soft/60 rounded-xl border border-border/40">
                <span className="block text-xl font-bold text-primary font-poppins">
                  $
                  {totalEarnings >= 1000
                    ? `${(totalEarnings / 1000).toFixed(1)}K`
                    : totalEarnings}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                  Earned
                </span>
              </div>
              <div className="p-3 bg-card-soft/60 rounded-xl border border-border/40">
                <span className="block text-xl font-bold text-primary font-poppins">
                  {activePendingRequests}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/*  কুইক স্ট্যাটস ব্যানার রো */}
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

          {/* analytics chart box*/}
          <div className="dashboard-card">
            <div className="pb-4 border-b border-border/50 mb-6">
              <h3 className="text-xl font-bold font-poppins text-foreground">
                Performance Insights
              </h3>
              <p className="text-base sm:text-sm text-muted-foreground mt-0.5">
                Monthly revenue generation analytics feed
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
                    dataKey="earnings"
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
              <span>
                Investment metrics synced via active delivery logs pipeline
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianProfile;
