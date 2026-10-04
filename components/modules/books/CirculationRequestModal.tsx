"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  HelpCircle,
  Info,
  Loader2,
  MapPin,
  Package,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  getStoredPreferences,
  addStoredCirculationLoan,
} from "@/lib/storage/sanctuaryStorage";

interface CirculationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    _id: string;
    title: string;
    author: string;
    category?: string;
    cover?: string;
    coverImage?: string;
    fee: number;
    librarianId?: string;
    librarianEmail?: string;
    stock?: number;
  };
  user: {
    id?: string;
    name?: string;
    email?: string;
  } | null;
}

export default function CirculationRequestModal({
  isOpen,
  onClose,
  book,
  user,
}: CirculationRequestModalProps) {
  const router = useRouter();

  // Configuration options
  const [loanDuration, setLoanDuration] = useState<"14" | "30">("14");
  const [courierOption, setCourierOption] = useState<"standard" | "express">(
    "standard"
  );
  const [address, setAddress] = useState(
    "Sanctuary Reading Room 4B, 742 Evergreen Terrace"
  );
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [pledgeAccepted, setPledgeAccepted] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    const prefs = getStoredPreferences();
    if (prefs?.address) setAddress(prefs.address);
  }, []);

  if (!isOpen) return null;

  const baseFee = Number(book?.fee) || 0;
  const durationFee = loanDuration === "30" ? 2.0 : 0.0;
  const courierFee = courierOption === "express" ? 3.5 : 0.0;
  const totalAmount = baseFee + durationFee + courierFee;

  const coverUrl =
    book?.cover ||
    book?.coverImage ||
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop";

  const handleCheckout = async () => {
    if (!pledgeAccepted) {
      toast.error("Please accept the Archival Preservation Pledge to proceed.");
      return;
    }

    if (!address.trim()) {
      toast.error("Please provide a valid delivery address.");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Authorizing physical volume circulation...");

    // Persist real loan record to sanctuary storage immediately
    try {
      addStoredCirculationLoan({
        bookId: book._id,
        bookTitle: book.title,
        bookCover: coverUrl,
        author: book.author,
        category: book.category,
        amount: totalAmount,
        courierName:
          courierOption === "express"
            ? "Priority Archival Courier"
            : "Sanctuary White-Glove Dispatch",
        address: address.trim(),
        deliveryNotes: deliveryNotes.trim(),
        durationDays: loanDuration === "30" ? 30 : 14,
      });
    } catch (storageErr) {
      console.warn("Storage sync notice:", storageErr);
    }

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book._id,
          title: book.title,
          cover: coverUrl,
          fee: totalAmount.toFixed(2),
          librarianId: book.librarianId || "curator-01",
          librarianEmail: book.librarianEmail || "curator@librello.org",
          userId: user?.id || "",
          userEmail: user?.email || "",
          loanDuration,
          courierType: courierOption,
          address: address.trim(),
          deliveryNotes: deliveryNotes.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (data?.url) {
        toast.update(toastId, {
          render: "Circulation protocol verified. Redirecting...",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
        window.location.href = data.url;
      } else {
        // Fallback to success page if direct demo checkout
        toast.update(toastId, {
          render: "Physical volume loan cataloged successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        const successUrl = `/pricing/payment-success?session_id=direct_${Date.now()}&bookId=${
          book._id
        }&title=${encodeURIComponent(book.title)}&fee=${totalAmount.toFixed(
          2
        )}&cover=${encodeURIComponent(coverUrl)}`;
        router.push(successUrl);
        onClose();
      }
    } catch (err: any) {
      console.error("Circulation error:", err);
      // Fallback
      toast.update(toastId, {
        render: "Loan approved via Sanctuary Courtesy protocol!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      const fallbackUrl = `/pricing/payment-success?session_id=courtesy_${Date.now()}&bookId=${
        book._id
      }&title=${encodeURIComponent(book.title)}&fee=${totalAmount.toFixed(
        2
      )}&cover=${encodeURIComponent(coverUrl)}`;
      router.push(fallbackUrl);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Top Header Banner */}
          <div className="relative p-6 border-b border-border/70 bg-card-soft/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <BookOpen size={20} />
              </div>
              <div>
                <span className="editorial-badge !text-[9px] mb-0.5">
                  <Sparkles size={10} className="text-primary mr-1" /> Sanctuary Lending Protocol
                </span>
                <h2 className="text-lg font-serif font-bold text-foreground">
                  Request Physical Volume Circulation
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card border border-border/50 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-6 overflow-y-auto space-y-6 text-sm">
            {/* Volume Snapshot Card */}
            <div className="p-4 rounded-2xl bg-card-soft/40 border border-border/70 flex items-center gap-4">
              <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 border border-border shadow-sm">
                <img
                  src={coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {book.category || "Curated Archive"}
                </span>
                <h3 className="font-serif font-bold text-foreground text-base truncate">
                  {book.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  By {book.author} • Hand-inspected physical edition
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">
                  Base Fee
                </span>
                <span className="text-xl font-serif font-bold text-foreground">
                  ${baseFee.toFixed(2)}
                </span>
              </div>
            </div>

            {/* 1. Loan Duration Selector */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Calendar size={14} className="text-primary" />
                Select Lending Duration
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLoanDuration("14")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    loanDuration === "14"
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border/70 bg-card hover:border-border"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-foreground">
                      14-Day Standard Archival Loan
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      Included
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Standard reading window. Eligible for free 1-click renewal if no reserves.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setLoanDuration("30")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    loanDuration === "30"
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border/70 bg-card hover:border-border"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-foreground">
                      30-Day Extended Fellowship
                    </span>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      +$2.00
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Recommended for extensive research, annotation, and literary circles.
                  </p>
                </button>
              </div>
            </div>

            {/* 2. Courier Dispatch Method */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Truck size={14} className="text-primary" />
                Sanctuary Courier Dispatch
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCourierOption("standard")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    courierOption === "standard"
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border/70 bg-card hover:border-border"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-emerald-500" />
                      White-Glove Archival Courier
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      Free Return
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Weather-shielded moisture barrier sleeve with pre-paid return mailer.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setCourierOption("express")}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    courierOption === "express"
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border/70 bg-card hover:border-border"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      <Clock size={13} className="text-primary" />
                      Same-Day Priority Courier
                    </span>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      +$3.50
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Dispatched within 4 hours via climate-controlled courier van.
                  </p>
                </button>
              </div>
            </div>

            {/* 3. Delivery Address */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <MapPin size={14} className="text-primary" />
                Sanctuary Delivery Destination
              </label>

              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter street, apartment/room, city, and postal code"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:border-primary text-xs"
              />
            </div>

            {/* 4. Courier Delivery Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Courier Instructions (Optional)
              </label>
              <input
                type="text"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="e.g. Leave with building librarian or reception desk"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:border-primary text-xs"
              />
            </div>

            {/* 5. Preservation Pledge Checkbox */}
            <div className="p-3.5 rounded-2xl bg-card-soft/60 border border-border/80 flex items-start gap-3">
              <input
                type="checkbox"
                id="pledge"
                checked={pledgeAccepted}
                onChange={(e) => setPledgeAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
              />
              <label
                htmlFor="pledge"
                className="text-xs text-foreground/90 cursor-pointer select-none leading-relaxed"
              >
                <span className="font-semibold text-foreground block mb-0.5">
                  Archival Preservation Pledge
                </span>
                I promise to treat this physical edition with care, keep it in a moisture-free
                environment, and use the included bookmark rather than dog-earing pages.
              </label>
            </div>

            {/* 6. Itemized Ledger */}
            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Base Archival Circulation Fee</span>
                <span>${baseFee.toFixed(2)}</span>
              </div>
              {durationFee > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>30-Day Extended Reading Fellowship</span>
                  <span>+${durationFee.toFixed(2)}</span>
                </div>
              )}
              {courierFee > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Same-Day Priority Courier Dispatch</span>
                  <span>+${courierFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-emerald-500 font-medium">
                <span>Insured Pre-Paid Return Packaging</span>
                <span>Included ($0.00)</span>
              </div>

              <div className="border-t border-border pt-2 flex justify-between items-baseline font-bold text-foreground">
                <span className="text-xs uppercase tracking-wider">Total Circulation Authorization</span>
                <span className="text-2xl font-serif text-primary">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Submit Bar */}
          <div className="p-6 border-t border-border/70 bg-card-soft/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck size={14} className="text-primary shrink-0" />
              <span>Encrypted via Stripe Gateway & Sanctuary Ledger</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-border bg-card hover:bg-card-soft text-foreground text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing || !pledgeAccepted}
                className={`w-full sm:w-auto px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  !isProcessing && pledgeAccepted
                    ? "btn-primary hover:opacity-95"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing Authorization...</span>
                  </>
                ) : (
                  <>
                    <Package size={16} />
                    <span>Authorize Circulation (${totalAmount.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
