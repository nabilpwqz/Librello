"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  DollarSign,
  Clock,
  TrendingUp,
  Camera,
  MapPin,
  Calendar,
  User,
  Search,
  Loader2,
  Edit2,
  Check,
  X,
  ShieldCheck,
  Bookmark,
  Sparkles,
  Package,
  Settings,
  Mail,
  FileText,
  CheckCircle2,
  Heart,
  Truck,
  Download,
  RotateCcw,
} from "lucide-react";
import { Avatar, Card } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getStoredPreferences,
  saveStoredPreferences,
  resetSanctuaryStorage,
  getStoredCirculation,
  getStoredShelf,
  getStoredReviews,
  CirculationRecord,
} from "@/lib/storage/sanctuaryStorage";

const UserProfile = ({ userPayment = [] }: { userPayment?: any[] }) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "security">("profile");

  // Avatar state
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  // Editable Profile fields
  const [isEditingName, setIsEditingName] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  const [bio, setBio] = useState(
    "Avid bibliophile and collector of classical prose, architectural treatises, and speculative philosophy."
  );
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [draftBio, setDraftBio] = useState(bio);

  const [address, setAddress] = useState("Sanctuary Reading Room 4B, 742 Evergreen Terrace");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [draftAddress, setDraftAddress] = useState(address);

  // Preferred reading circles
  const [favoriteGenres, setFavoriteGenres] = useState([
    "Philosophy",
    "Literature",
    "History",
    "Science",
  ]);

  const [storedCirculationList, setStoredCirculationList] = useState<CirculationRecord[]>([]);

  // Load preferences from sanctuary storage on mount
  useEffect(() => {
    const prefs = getStoredPreferences();
    if (prefs.bio) {
      setBio(prefs.bio);
      setDraftBio(prefs.bio);
    }
    if (prefs.address) {
      setAddress(prefs.address);
      setDraftAddress(prefs.address);
    }
    if (prefs.favoriteGenres && prefs.favoriteGenres.length > 0) {
      setFavoriteGenres(prefs.favoriteGenres);
    }
    setStoredCirculationList(getStoredCirculation());

    const handleUpdate = () => {
      const updatedPrefs = getStoredPreferences();
      if (updatedPrefs.bio) setBio(updatedPrefs.bio);
      if (updatedPrefs.address) setAddress(updatedPrefs.address);
      if (updatedPrefs.favoriteGenres) setFavoriteGenres(updatedPrefs.favoriteGenres);
      setStoredCirculationList(getStoredCirculation());
    };

    window.addEventListener("sanctuary_storage_updated", handleUpdate);
    return () => {
      window.removeEventListener("sanctuary_storage_updated", handleUpdate);
    };
  }, []);

  const allAvailableGenres = [
    "Literature",
    "Philosophy",
    "History",
    "Science",
    "Essays",
    "Biography",
    "Poetry",
    "Arts",
  ];

  // Safe payment array normalization merged with stored records
  const safePayments = useMemo(() => {
    const rawProps = Array.isArray(userPayment)
      ? userPayment
      : userPayment && Array.isArray((userPayment as any).data)
      ? (userPayment as any).data
      : userPayment && Array.isArray((userPayment as any).payments)
      ? (userPayment as any).payments
      : [];

    const map = new Map<string, any>();
    rawProps.forEach((item: any) => {
      const id = item?.transactionId || item?._id || Math.random().toString();
      map.set(id, item);
    });
    storedCirculationList.forEach((item) => {
      map.set(item.transactionId, item);
    });

    return Array.from(map.values());
  }, [userPayment, storedCirculationList]);

  // Real stats calculation
  const totalRead = safePayments.filter((item: any) => item?.status === "Delivered").length;
  const pendingDeliveries = safePayments.filter(
    (item: any) => item?.status === "Pending" || item?.status === "Dispatched"
  ).length;
  const totalSpent = safePayments.reduce(
    (sum: number, item: any) => sum + (Number(item?.amount) || 0),
    0
  );

  const monthlySpentObj = safePayments.reduce((acc: Record<string, number>, item: any) => {
    const monthName = item?.month || "Current";
    acc[monthName] = (acc[monthName] || 0) + (Number(item?.amount) || 0);
    return acc;
  }, {});

  const analyticsData = useMemo(() => {
    const data = Object.keys(monthlySpentObj).map((month) => ({
      name: month,
      spending: monthlySpentObj[month],
    }));
    if (data.length > 0) return data;
    return [
      { name: "Jan", spending: 0 },
      { name: "Feb", spending: 0 },
      { name: "Mar", spending: 0 },
      { name: "Apr", spending: totalSpent || 0 },
    ];
  }, [monthlySpentObj, totalSpent]);

  // Name update handler
  const handleSaveName = async () => {
    if (!updatedName.trim()) {
      return toast.error("Name cannot be empty.");
    }
    if (updatedName === user?.name) {
      setIsEditingName(false);
      return;
    }

    setIsSavingName(true);
    const toastId = toast.loading("Updating profile identity...");

    try {
      const result = await authClient.updateUser({
        name: updatedName.trim(),
        image: user?.image,
      });

      if (result?.data) {
        toast.update(toastId, {
          render: "Identity updated successfully.",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setIsEditingName(false);
        router.refresh();
      } else if (result?.error) {
        throw new Error(result.error.message);
      }
    } catch (error: any) {
      toast.update(toastId, {
        render: error.message || "Failed to update name.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsSavingName(false);
    }
  };

  // Avatar upload handler
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select a valid image file.");
    }

    setIsUpdatingAvatar(true);
    const toastId = toast.loading("Updating sanctuary avatar...");

    const imgBBFormData = new FormData();
    imgBBFormData.append("image", file);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    try {
      let secureImageUrl = "";
      if (apiKey && apiKey !== "demo") {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: imgBBFormData,
        });
        const data = await response.json();
        if (data.success) {
          secureImageUrl = data.data.url;
        }
      }

      // If imgbb is demo or unavailable, create a local object URL for preview
      if (!secureImageUrl) {
        secureImageUrl = URL.createObjectURL(file);
      }

      const result = await authClient.updateUser({
        image: secureImageUrl,
        name: user?.name,
      });

      if (result?.data) {
        toast.update(toastId, {
          render: "Avatar updated successfully.",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        router.refresh();
      } else if (result?.error) {
        throw new Error(result.error.message);
      }
    } catch (error: any) {
      toast.update(toastId, {
        render: error.message || "Failed to update profile avatar.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const toggleGenre = (genre: string) => {
    const updated = favoriteGenres.includes(genre)
      ? favoriteGenres.filter((g) => g !== genre)
      : [...favoriteGenres, genre];
    setFavoriteGenres(updated);
    saveStoredPreferences({ favoriteGenres: updated });
    toast.info(`Updated reading preferences: ${genre}`);
  };

  const handleSaveBio = () => {
    setBio(draftBio);
    setIsEditingBio(false);
    saveStoredPreferences({ bio: draftBio });
    toast.success("Reader bio saved and synchronized across sanctuary.");
  };

  const handleSaveAddress = () => {
    setAddress(draftAddress);
    setIsEditingAddress(false);
    saveStoredPreferences({ address: draftAddress });
    toast.success("Default doorstep address saved and synchronized.");
  };

  const handleExportFullDossier = () => {
    const dossier = {
      sanctuaryMember: {
        id: user?.id || user?.uid || "patron-2026",
        name: user?.name || "Sanctuary Reader",
        email: user?.email || "reader@librello.org",
        bio,
        address,
        favoriteGenres,
      },
      circulationLoans: getStoredCirculation(),
      activeShelf: getStoredShelf(),
      marginaliaReviews: getStoredReviews(),
      exportedAt: new Date().toISOString(),
    };

    const json = JSON.stringify(dossier, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", `librello-reader-dossier-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Complete Archival Dossier (.json) exported successfully!");
  };

  const handleResetCache = () => {
    if (confirm("Reset local sanctuary reading desk and circulation cache?")) {
      resetSanctuaryStorage();
      toast.success("Local sanctuary storage reset. Defaults restored.");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div className="w-full text-foreground min-h-screen pb-16 select-none">
      {/* 1. EDITORIAL HEADER & PARALLAX COVER */}
      <div className="relative rounded-3xl border border-border/70 bg-card/60 shadow-sm overflow-hidden mb-8">
        <div className="h-52 md:h-72 w-full relative overflow-hidden bg-muted">
          <img
            src="https://images.unsplash.com/photo-1507842229452-78927a6e19e2?auto=format&fit=crop&q=80&w=1600"
            alt="Library Archival Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="editorial-badge !bg-background/80 backdrop-blur-md">
              <Sparkles size={11} className="text-primary mr-1" /> Sanctuary Member Portal
            </span>
          </div>
        </div>

        {/* User Identity Bar */}
        <div className="max-w-6xl mx-auto px-6 pb-8 relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20 md:-mt-24">
          {/* Avatar with Camera Overlay */}
          <div className="relative z-10 shrink-0">
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full ring-4 ring-background bg-card shadow-2xl overflow-hidden relative group">
              <img
                src={
                  user?.image ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                }
                alt={user?.name || "Reader Avatar"}
                className="w-full h-full object-cover"
              />

              {isUpdatingAvatar && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-primary z-20">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              )}
            </div>

            <label className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-2.5 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer border-2 border-background flex items-center justify-center">
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

          {/* User Name & Details */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-xl shadow-sm max-w-sm w-full">
                  <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    disabled={isSavingName}
                    className="bg-transparent text-lg font-serif font-bold w-full focus:outline-none text-foreground"
                    placeholder="Enter full name"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isSavingName}
                    className="p-1 hover:bg-emerald-500/10 rounded-md text-emerald-500 transition-colors"
                  >
                    {isSavingName ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    disabled={isSavingName}
                    className="p-1 hover:bg-destructive/10 rounded-md text-destructive transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-serif font-medium text-foreground tracking-tight">
                    {user?.name || "Distinguished Reader"}
                  </h1>
                  <button
                    onClick={() => {
                      setUpdatedName(user?.name || "");
                      setIsEditingName(true);
                    }}
                    className="p-1 rounded-md text-muted-foreground hover:text-primary transition-colors"
                    title="Edit Name"
                  >
                    <Edit2 size={15} />
                  </button>
                </div>
              )}

              <span className="text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 px-3 py-0.5 rounded-full uppercase tracking-wider">
                {user?.role || "Archival Patron"}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl font-normal">
              {bio}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <Mail size={13} className="text-primary" />
                {user?.email || "reader@librello.org"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-500" />
                Verified Circulation Member
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                Joined Librello 2026
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/books">
              <button className="btn-primary !px-5 !py-2.5 text-xs font-semibold inline-flex items-center gap-1.5">
                <Search size={14} /> Browse Catalog
              </button>
            </Link>
          </div>
        </div>

        {/* 2. PROFILE NAVIGATION TABS */}
        <div className="px-6 border-t border-border/60 flex items-center gap-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === "profile"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Sanctuary Overview
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`py-3.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === "preferences"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Lending Preferences & Circles
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`py-3.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === "security"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Account Security & Privileges
          </button>
        </div>
      </div>

      {/* 3. TAB CONTENT */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Identity & Bio (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Bio Card */}
            <div className="border border-border/70 bg-card/40 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-semibold text-base text-foreground">
                  Reader Bio & Philosophy
                </h3>
                <button
                  onClick={() => {
                    setDraftBio(bio);
                    setIsEditingBio(!isEditingBio);
                  }}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Edit2 size={12} /> {isEditingBio ? "Cancel" : "Edit"}
                </button>
              </div>

              {isEditingBio ? (
                <div className="space-y-3">
                  <textarea
                    value={draftBio}
                    onChange={(e) => setDraftBio(e.target.value)}
                    rows={3}
                    className="w-full text-xs p-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={handleSaveBio}
                    className="btn-primary !px-4 !py-1.5 text-xs font-semibold cursor-pointer"
                  >
                    Save Bio
                  </button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  &ldquo;{bio}&rdquo;
                </p>
              )}

              <div className="border-t border-border/50 pt-3 space-y-2 text-xs">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Sanctuary ID:</span>
                  <span className="font-mono text-foreground">
                    LIB-{(user?.id || user?.uid || "2026").slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Circulation Status:</span>
                  <span className="text-emerald-500 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Active Patron
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Matrix */}
            <div className="border border-border/70 bg-card/40 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-serif font-semibold text-base text-foreground">
                Circulation Snapshot
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-card-soft/60 rounded-2xl border border-border/50">
                  <span className="block text-xl font-bold font-serif text-primary">
                    {totalRead}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                    Volumes Read
                  </span>
                </div>
                <div className="p-3 bg-card-soft/60 rounded-2xl border border-border/50">
                  <span className="block text-xl font-bold font-serif text-primary">
                    ${totalSpent.toFixed(0)}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                    Fees Invested
                  </span>
                </div>
                <div className="p-3 bg-card-soft/60 rounded-2xl border border-border/50">
                  <span className="block text-xl font-bold font-serif text-amber-500">
                    {pendingDeliveries}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                    In Transit
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Spending & Reading Chart (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border border-border/70 bg-card/40 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <div>
                  <h3 className="font-serif font-semibold text-lg text-foreground">
                    Reading & Fee Progression
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Monthly investment towards physical book circulation and archival preservation
                  </p>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-full border border-border/60">
                  USD ($)
                </span>
              </div>

              <div className="w-full h-72 pt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analyticsData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="userPrimaryGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.12)" />
                    <XAxis
                      dataKey="name"
                      stroke="currentColor"
                      className="text-muted-foreground"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="currentColor"
                      className="text-muted-foreground"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "14px",
                        color: "hsl(var(--foreground))",
                        fontSize: "12px",
                      }}
                      formatter={(val) => [`$${val}`, "Spending"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="spending"
                      stroke="rgb(var(--primary))"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#userPrimaryGlow)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
                <span className="flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-primary" />
                  Real-time analytics synced across all reading sessions
                </span>
                <Link
                  href="/dashboard/user/userDeliveryHistory"
                  className="text-primary hover:underline font-semibold"
                >
                  View Full Delivery History &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "preferences" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Preferred Reading Circles & Genres */}
          <div className="border border-border/70 bg-card/40 rounded-3xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="font-serif font-semibold text-lg text-foreground">
                Favorite Literary Circles
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select your areas of inquiry to personalize recommendations from Librello Concierge
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {allAvailableGenres.map((genre) => {
                const isSelected = favoriteGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/25"
                        : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Doorstep Delivery Address */}
          <div className="border border-border/70 bg-card/40 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-semibold text-lg text-foreground">
                  Default Courier Address
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Used for doorstep physical volume delivery and return pickups
                </p>
              </div>
              <button
                onClick={() => {
                  setDraftAddress(address);
                  setIsEditingAddress(!isEditingAddress);
                }}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Edit2 size={12} /> {isEditingAddress ? "Cancel" : "Edit"}
              </button>
            </div>

            {isEditingAddress ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={draftAddress}
                  onChange={(e) => setDraftAddress(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter shipping address"
                />
                <button
                  onClick={handleSaveAddress}
                  className="btn-primary !px-4 !py-1.5 text-xs font-semibold cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border/60">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-foreground block">
                    Primary Destination
                  </span>
                  <span className="text-muted-foreground">{address}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="max-w-3xl border border-border/70 bg-card/40 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="font-serif font-semibold text-lg text-foreground">
              Sanctuary Access, Privileges & Data Management
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review authentication mechanisms, physical volume loans, and download your archival identity dossier
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">
                    Firebase Authentication
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Connected to email account: {user?.email}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                Active & Verified
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">
                    Circulation Standing
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Zero overdue books, eligible for up to 3 simultaneous loans
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-primary/15 text-primary px-2.5 py-1 rounded-full">
                Full Privileges
              </span>
            </div>

            {/* Archival Ledger Management Actions */}
            <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-3">
              <h4 className="text-xs font-serif font-bold text-foreground">
                Reader Ledger Archiving & Cache Control
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Download your complete reading history, bookmarks, circulation logs, and literary reviews as a verified JSON dossier, or reset your local device cache.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={handleExportFullDossier}
                  className="btn-primary !px-4 !py-2 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download size={13} />
                  Download Reader Dossier (.json)
                </button>

                <button
                  onClick={handleResetCache}
                  className="px-4 py-2 rounded-xl border border-border hover:border-rose-500/50 bg-card hover:bg-rose-500/10 text-xs font-semibold text-muted-foreground hover:text-rose-500 inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} />
                  Reset Sanctuary Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

