"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  History,
  BookOpen,
  Calendar,
  Clock,
  Truck,
  CheckCircle2,
  Copy,
  Search,
  ExternalLink,
  Package,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Filter,
  X,
  FileText,
  Printer,
  Download,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getStoredCirculation,
  updateStoredCirculationStatus,
  CirculationRecord,
} from "@/lib/storage/sanctuaryStorage";

const DEFAULT_ARCHIVAL_CIRCULATION = [
  {
    _id: "circ-01",
    transactionId: "LIB-TRK-984210",
    bookId: "book-lib-01",
    bookTitle: "The Midnight Library",
    bookCover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    author: "Matt Haig",
    category: "Literature",
    amount: 4.5,
    status: "Delivered",
    createdAt: "2026-09-18T14:32:00.000Z",
    returnDeadline: "2026-10-02T14:32:00.000Z",
    courierName: "Sanctuary White-Glove Dispatch",
    address: "Sanctuary Reading Room 4B, 742 Evergreen Terrace",
  },
  {
    _id: "circ-02",
    transactionId: "LIB-TRK-741932",
    bookId: "book-lib-02",
    bookTitle: "Meditations: Annotated Imperial Edition",
    bookCover:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    author: "Marcus Aurelius",
    category: "Philosophy",
    amount: 3.5,
    status: "Dispatched",
    createdAt: "2026-09-28T09:15:00.000Z",
    returnDeadline: "2026-10-12T09:15:00.000Z",
    courierName: "Priority Archival Courier",
    address: "Sanctuary Reading Room 4B, 742 Evergreen Terrace",
  },
  {
    _id: "circ-03",
    transactionId: "LIB-TRK-610284",
    bookId: "book-lib-05",
    bookTitle: "Cosmos",
    bookCover:
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=800",
    author: "Carl Sagan",
    category: "Science",
    amount: 4.5,
    status: "Pending",
    createdAt: "2026-10-02T16:40:00.000Z",
    returnDeadline: "2026-10-16T16:40:00.000Z",
    courierName: "Sanctuary Standard Dispatch",
    address: "Sanctuary Reading Room 4B, 742 Evergreen Terrace",
  },
];

const UserDeliveryHistory = ({ userPayment = [] }: { userPayment?: any }) => {
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrackingItem, setSelectedTrackingItem] = useState<any>(null);
  const [selectedWaybillItem, setSelectedWaybillItem] = useState<any>(null);
  const [storedCirc, setStoredCirc] = useState<CirculationRecord[]>([]);

  useEffect(() => {
    setStoredCirc(getStoredCirculation());
    const onUpdate = () => setStoredCirc(getStoredCirculation());
    window.addEventListener("sanctuary_storage_updated", onUpdate);
    return () => window.removeEventListener("sanctuary_storage_updated", onUpdate);
  }, []);

  // Normalize payment list and merge with stored persistent circulation
  const paymentList = useMemo(() => {
    const rawList = Array.isArray(userPayment)
      ? userPayment
      : Array.isArray(userPayment?.data)
      ? userPayment.data
      : Array.isArray(userPayment?.payments)
      ? userPayment.payments
      : [];

    const map = new Map<string, any>();
    DEFAULT_ARCHIVAL_CIRCULATION.forEach((item) => map.set(item.transactionId, item));
    rawList.forEach((item: any) => {
      const key = item?.transactionId || item?._id || Math.random().toString();
      map.set(key, item);
    });
    storedCirc.forEach((item) => map.set(item.transactionId, item));

    return Array.from(map.values());
  }, [userPayment, storedCirc]);

  // Statistics calculation
  const totalVolumeCount = paymentList.length;
  const inTransitCount = paymentList.filter(
    (item) => item?.status === "Dispatched" || item?.status === "Pending"
  ).length;
  const deliveredCount = paymentList.filter(
    (item) => item?.status === "Delivered" || item?.status === "Returned"
  ).length;
  const cumulativeFees = paymentList.reduce(
    (sum, item) => sum + (Number(item?.amount) || 0),
    0
  );

  // Filtered dataset
  const filteredList = useMemo(() => {
    return paymentList.filter((item) => {
      const matchStatus =
        filterStatus === "All" ||
        item?.status?.toLowerCase() === filterStatus.toLowerCase();

      const searchLower = searchQuery.toLowerCase().trim();
      const matchSearch =
        !searchLower ||
        item?.bookTitle?.toLowerCase().includes(searchLower) ||
        (item?.transactionId &&
          item.transactionId.toLowerCase().includes(searchLower)) ||
        (item?.author && item.author.toLowerCase().includes(searchLower));

      return matchStatus && matchSearch;
    });
  }, [paymentList, filterStatus, searchQuery]);

  const copyTracking = (tracking: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(tracking);
      toast.success(`Tracking code ${tracking} copied to clipboard!`);
    }
  };

  const handleConfirmReceipt = (item: any) => {
    const tracking = item?.transactionId || item?._id;
    updateStoredCirculationStatus(tracking, "Delivered");
    toast.success(`Delivery confirmed! "${item?.bookTitle}" is now marked delivered.`);
  };

  const handleExportCSV = () => {
    if (paymentList.length === 0) {
      toast.info("No circulation records to export.");
      return;
    }

    const headers = [
      "Tracking Code",
      "Volume Title",
      "Author",
      "Category",
      "Circulation Fee ($)",
      "Status",
      "Dispatched Date",
      "Return Deadline",
      "Courier Dispatcher",
    ];

    const rows = paymentList.map((item) => [
      `"${item.transactionId || ""}"`,
      `"${(item.bookTitle || "").replace(/"/g, '""')}"`,
      `"${(item.author || "").replace(/"/g, '""')}"`,
      `"${item.category || ""}"`,
      Number(item.amount || 0).toFixed(2),
      `"${item.status || "Delivered"}"`,
      `"${item.createdAt || ""}"`,
      `"${item.returnDeadline || ""}"`,
      `"${item.courierName || ""}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `librello-circulation-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Circulation Ledger CSV generated and downloaded!");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Recent";
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return "Recent";

    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Delivered to Sanctuary
          </span>
        );
      case "Dispatched":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            In Courier Transit
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Curator Inspection
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 text-foreground pt-2 w-full font-sans pb-16">
      {/* 1. SECTION HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="editorial-badge !text-[9px]">
              <Sparkles size={10} className="text-primary mr-1" /> Archival Logistics
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight">
            Circulation & Dispatch History
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Complete physical provenance ledger, courier shipments, and volume return schedules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-border hover:border-primary text-muted-foreground hover:text-foreground bg-card text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            title="Download complete circulation ledger as CSV"
          >
            <Download size={13} />
            Export Ledger (CSV)
          </button>

          <Link
            href="/books"
            className="btn-primary self-start md:self-auto text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
          >
            <BookOpen size={14} />
            Explore Archive
          </Link>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Circulations</span>
            <BookOpen size={16} className="text-primary" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground">
            {totalVolumeCount}
          </p>
          <span className="text-[11px] text-muted-foreground">Cataloged volume loans</span>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">In Active Transit</span>
            <Truck size={16} className="text-primary" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground">
            {inTransitCount}
          </p>
          <span className="text-[11px] text-emerald-500 font-medium">Climate-controlled van</span>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Delivered & Held</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground">
            {deliveredCount}
          </p>
          <span className="text-[11px] text-muted-foreground">In member sanctuaries</span>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Circulation Fees</span>
            <ShieldCheck size={16} className="text-primary" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground">
            ${cumulativeFees.toFixed(2)}
          </p>
          <span className="text-[11px] text-muted-foreground">Zero damage penalties</span>
        </div>
      </div>

      {/* 3. CONTROLS: SEARCH & FILTER TABS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl border border-border/80 bg-card-soft/40 w-full sm:w-auto">
          {["All", "Dispatched", "Delivered", "Pending"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                filterStatus === status
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status === "All"
                ? "All Records"
                : status === "Dispatched"
                ? "In Transit"
                : status}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, tracking #..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/80 bg-card text-xs text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground/70"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 4. MAIN CIRCULATION LEDGER */}
      {filteredList.length === 0 ? (
        <div className="border border-dashed border-border rounded-3xl p-14 text-center text-muted-foreground flex flex-col items-center justify-center gap-3 bg-card/20">
          <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center border border-border text-muted-foreground">
            <History size={22} />
          </div>
          <p className="font-serif font-bold text-foreground text-lg">
            No Circulation Records Found
          </p>
          <p className="text-xs max-w-sm">
            {searchQuery
              ? "No loans match your search criteria. Try a different query."
              : "You haven't requested any volume loans yet. Browse our archive to begin."}
          </p>
          <Link
            href="/books"
            className="btn-primary text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl mt-2"
          >
            Browse Sanctuary Archive
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block border border-border/80 bg-card/60 backdrop-blur-md rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-card-soft/60 text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-b border-border/70">
                  <th className="p-4 pl-6">Physical Volume</th>
                  <th className="p-4">Tracking Code</th>
                  <th className="p-4">Circulation Fee</th>
                  <th className="p-4">Dispatched</th>
                  <th className="p-4">Return Schedule</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60 text-xs">
                {filteredList.map((item: any) => {
                  const tracking =
                    item?.transactionId ||
                    `LIB-TRK-${(item?._id || "928340").slice(-6).toUpperCase()}`;

                  const cover =
                    item?.bookCover ||
                    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop";

                  return (
                    <tr
                      key={item?._id || tracking}
                      className="hover:bg-card-soft/30 transition-colors group"
                    >
                      {/* Volume Info */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={cover}
                            alt={item?.bookTitle || "Book"}
                            className="w-10 h-14 rounded-lg object-cover border border-border shrink-0"
                          />
                          <div>
                            <Link
                              href={`/books/${item?.bookId || ""}`}
                              className="font-serif font-bold text-sm text-foreground hover:text-primary transition-colors block line-clamp-1"
                            >
                              {item?.bookTitle || "Untitled Volume"}
                            </Link>
                            <span className="text-[11px] text-muted-foreground">
                              {item?.author || "Curated Author"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Tracking */}
                      <td className="p-4 font-mono">
                        <button
                          onClick={() => copyTracking(tracking)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card-soft hover:bg-muted text-foreground/90 border border-border transition-colors cursor-pointer text-xs"
                          title="Click to copy tracking code"
                        >
                          <span>{tracking}</span>
                          <Copy size={11} className="text-muted-foreground" />
                        </button>
                      </td>

                      {/* Fee */}
                      <td className="p-4 font-semibold text-foreground">
                        ${Number(item?.amount || 0).toFixed(2)}
                      </td>

                      {/* Date Dispatched */}
                      <td className="p-4 text-muted-foreground">
                        {formatDate(item?.createdAt)}
                      </td>

                      {/* Return Schedule */}
                      <td className="p-4">
                        <span className="font-medium text-foreground">
                          {formatDate(item?.returnDeadline || item?.createdAt)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">{getStatusBadge(item?.status || "Pending")}</td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(item?.status === "Dispatched" || item?.status === "Pending") && (
                            <button
                              onClick={() => handleConfirmReceipt(item)}
                              className="px-2.5 py-1.5 rounded-xl border border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                              title="Confirm Volume Received & Delivered"
                            >
                              <Check size={12} />
                              Received
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedWaybillItem(item)}
                            className="p-2 rounded-xl border border-border hover:border-primary text-muted-foreground hover:text-foreground bg-card transition-all cursor-pointer"
                            title="View Archival Physical Waybill & Manifest"
                          >
                            <FileText size={14} />
                          </button>

                          <button
                            onClick={() => setSelectedTrackingItem(item)}
                            className="p-2 rounded-xl border border-border hover:border-primary text-muted-foreground hover:text-foreground bg-card transition-all cursor-pointer"
                            title="Track Courier Timeline"
                          >
                            <Truck size={14} />
                          </button>

                          <Link
                            href={`/books/${item?.bookId || ""}`}
                            className="p-2 rounded-xl border border-border hover:border-primary text-muted-foreground hover:text-foreground bg-card transition-all"
                            title="View Volume Archive"
                          >
                            <ArrowUpRight size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
            {filteredList.map((item: any) => {
              const tracking =
                item?.transactionId ||
                `LIB-TRK-${(item?._id || "928340").slice(-6).toUpperCase()}`;

              const cover =
                item?.bookCover ||
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop";

              return (
                <div
                  key={item?._id || tracking}
                  className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={cover}
                      alt={item?.bookTitle || "Book"}
                      className="w-14 h-20 rounded-xl object-cover border border-border shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start">
                        {getStatusBadge(item?.status || "Pending")}
                        <span className="font-serif font-bold text-foreground">
                          ${Number(item?.amount || 0).toFixed(2)}
                        </span>
                      </div>
                      <Link
                        href={`/books/${item?.bookId || ""}`}
                        className="font-serif font-bold text-sm text-foreground hover:text-primary transition-colors block line-clamp-1 pt-1"
                      >
                        {item?.bookTitle || "Untitled Volume"}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {item?.author || "Curated Author"}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-card-soft/40 border border-border/60 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[11px]">Tracking:</span>
                      <button
                        onClick={() => copyTracking(tracking)}
                        className="font-mono font-semibold text-foreground flex items-center gap-1"
                      >
                        {tracking} <Copy size={10} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[11px]">Dispatched:</span>
                      <span className="text-foreground">{formatDate(item?.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[11px]">Return Due:</span>
                      <span className="text-foreground font-semibold">
                        {formatDate(item?.returnDeadline || item?.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {(item?.status === "Dispatched" || item?.status === "Pending") && (
                      <button
                        onClick={() => handleConfirmReceipt(item)}
                        className="w-full py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Check size={13} />
                        Confirm Volume Handover Received
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedWaybillItem(item)}
                      className="flex-1 py-2.5 rounded-xl border border-border hover:border-primary text-xs font-semibold text-foreground bg-card transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText size={13} />
                      Waybill
                    </button>

                    <button
                      onClick={() => setSelectedTrackingItem(item)}
                      className="flex-1 py-2.5 rounded-xl border border-border hover:border-primary text-xs font-semibold text-foreground bg-card transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Truck size={13} />
                      Track
                    </button>

                    <Link
                      href={`/books/${item?.bookId || ""}`}
                      className="py-2.5 px-3 rounded-xl border border-border hover:border-primary text-xs font-semibold text-foreground bg-card transition-all flex items-center justify-center gap-1"
                    >
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. COURIER TRACKING TIMELINE MODAL */}
      {selectedTrackingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-card border border-border/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-start border-b border-border/70 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Live Dispatch Logistics
                </span>
                <h3 className="text-lg font-serif font-bold text-foreground">
                  {selectedTrackingItem?.bookTitle}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {selectedTrackingItem?.transactionId || "LIB-TRK-741932"}
                </p>
              </div>

              <button
                onClick={() => setSelectedTrackingItem(null)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card-soft border border-border transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <span className="font-bold text-foreground block">
                    Curator Quality Inspection
                  </span>
                  <p className="text-muted-foreground text-[11px]">
                    Volume pulled from sanctuary stacks, conditioned, and sealed in an archival sleeve.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/30 flex items-center justify-center shrink-0">
                  <Truck size={16} />
                </div>
                <div>
                  <span className="font-bold text-foreground block">
                    White-Glove Courier Transit
                  </span>
                  <p className="text-muted-foreground text-[11px]">
                    Dispatched in weather-protected carrier with prepaid return parcel.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    selectedTrackingItem?.status === "Delivered"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  <Package size={16} />
                </div>
                <div>
                  <span className="font-bold text-foreground block">
                    Sanctuary Delivery Arrival
                  </span>
                  <p className="text-muted-foreground text-[11px]">
                    {selectedTrackingItem?.status === "Delivered"
                      ? "Successfully handed over to reader sanctuary."
                      : "Estimated delivery within 24 to 48 hours."}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => setSelectedTrackingItem(null)}
                className="btn-primary text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. PHYSICAL WAYBILL & MANIFEST MODAL */}
      {selectedWaybillItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-card border border-border/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-border/70 pb-4">
              <div>
                <span className="editorial-badge !text-[9px] mb-1">
                  Physical Circulation Manifest
                </span>
                <h3 className="text-xl font-serif font-bold text-foreground">
                  Official Archival Waybill
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {selectedWaybillItem?.transactionId || "LIB-TRK-984210"}
                </p>
              </div>

              <button
                onClick={() => setSelectedWaybillItem(null)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card-soft border border-border transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Manifest Content */}
            <div className="p-5 rounded-2xl bg-card-soft/50 border border-border space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/60">
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">
                    Issued Volume
                  </span>
                  <span className="font-serif font-bold text-sm text-foreground block">
                    {selectedWaybillItem?.bookTitle}
                  </span>
                  <span className="text-muted-foreground">
                    by {selectedWaybillItem?.author || "Curated Author"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">
                    Circulation Status
                  </span>
                  <span className="font-bold text-primary block text-sm">
                    {selectedWaybillItem?.status || "Delivered"}
                  </span>
                  <span className="text-muted-foreground font-mono">
                    Fee: ${Number(selectedWaybillItem?.amount || 0).toFixed(2)} USD
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/60">
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">
                    Consignee Destination
                  </span>
                  <span className="text-foreground font-medium block">
                    {selectedWaybillItem?.address || "Sanctuary Reading Room 4B, 742 Evergreen Terrace"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">
                    Courier Service
                  </span>
                  <span className="text-foreground font-medium block">
                    {selectedWaybillItem?.courierName || "Sanctuary White-Glove Dispatch"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">
                    Dispatch Date
                  </span>
                  <span className="text-foreground font-mono">
                    {formatDate(selectedWaybillItem?.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">
                    Mandatory Return Schedule
                  </span>
                  <span className="text-emerald-500 font-mono font-bold">
                    {formatDate(selectedWaybillItem?.returnDeadline || selectedWaybillItem?.createdAt)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border/70 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Preservation Seal: Intact & Climate Protected
                </span>
                <span className="font-mono text-[10px]">VERIFIED-2026</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.print();
                  }
                }}
                className="px-4 py-2.5 rounded-xl border border-border hover:border-primary text-xs font-semibold text-foreground bg-card flex items-center gap-2 transition-all cursor-pointer"
              >
                <Printer size={13} />
                Print / Save Waybill
              </button>

              <button
                onClick={() => setSelectedWaybillItem(null)}
                className="btn-primary text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Close Waybill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDeliveryHistory;
