"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Heart,
  Loader2,
  MessageSquare,
  Package,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { addUserComment, userBookReturnStatusUpdate } from "@/lib/actions/users";
import { useRouter } from "next/navigation";
import {
  getStoredShelf,
  updateStoredPageProgress,
  renewStoredVolumeLoan,
  requestStoredVolumeReturn,
  addStoredReview,
} from "@/lib/storage/sanctuaryStorage";

interface ReadingVolume {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  author?: string;
  category?: string;
  totalPages?: number;
  currentPage?: number;
  status: "Delivered" | "Return Requested" | "Returned" | "Dispatched";
  dueDate: string;
  borrowedDate: string;
  notes?: string;
}

const DEFAULT_READING_VOLUMES: ReadingVolume[] = [
  {
    _id: "read-vol-01",
    bookId: "book-lib-01",
    bookTitle: "The Midnight Library",
    author: "Matt Haig",
    category: "Literature",
    bookCover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    totalPages: 304,
    currentPage: 168,
    status: "Delivered",
    borrowedDate: "2026-09-24T10:00:00.000Z",
    dueDate: "2026-10-08T10:00:00.000Z",
  },
  {
    _id: "read-vol-02",
    bookId: "book-lib-03",
    bookTitle: "Ficciones",
    author: "Jorge Luis Borges",
    category: "Literature",
    bookCover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    totalPages: 174,
    currentPage: 120,
    status: "Delivered",
    borrowedDate: "2026-09-28T14:30:00.000Z",
    dueDate: "2026-10-12T14:30:00.000Z",
  },
  {
    _id: "read-vol-03",
    bookId: "book-lib-06",
    bookTitle: "Letters to a Young Poet",
    author: "Rainer Maria Rilke",
    category: "Essays",
    bookCover:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
    totalPages: 144,
    currentPage: 144,
    status: "Return Requested",
    borrowedDate: "2026-09-15T09:00:00.000Z",
    dueDate: "2026-09-29T09:00:00.000Z",
  },
];

const MyReadingList = ({ userPayment = [] }: { userPayment?: any[] }) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Active Shelf Volumes
  const [shelfVolumes, setShelfVolumes] = useState<ReadingVolume[]>([]);
  const [selectedBookForReview, setSelectedBookForReview] = useState<ReadingVolume | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [loadingReturnId, setLoadingReturnId] = useState<string | null>(null);

  // Initialize and synchronize shelf items
  useEffect(() => {
    // 1. Load from persistent sanctuary storage
    const stored = getStoredShelf();
    setShelfVolumes(stored);

    // 2. Listen for real-time storage events (e.g. newly borrowed books from modal)
    const handleStorageUpdate = () => {
      setShelfVolumes(getStoredShelf());
    };

    window.addEventListener("sanctuary_storage_updated", handleStorageUpdate);
    return () => {
      window.removeEventListener("sanctuary_storage_updated", handleStorageUpdate);
    };
  }, []);

  // Reading Shelf Analytics
  const activeCount = shelfVolumes.filter((v) => v.status === "Delivered").length;
  const totalPagesRead = shelfVolumes.reduce((sum, v) => sum + (v.currentPage || 0), 0);
  const returnsQueued = shelfVolumes.filter((v) => v.status === "Return Requested").length;

  // Handle Progress Update (Persisted)
  const handleUpdateProgress = (volId: string, newPage: number) => {
    const updated = updateStoredPageProgress(volId, newPage);
    setShelfVolumes(updated);
    toast.success("Reading progress recorded and saved to sanctuary registry.");
  };

  // 1-Click Loan Renewal (+14 Days Persisted)
  const handleRenewLoan = (vol: ReadingVolume) => {
    const updated = renewStoredVolumeLoan(vol._id, 14);
    setShelfVolumes(updated);
    toast.success(
      `Circulation renewed for "${vol.bookTitle}"! Added +14 days to your loan schedule.`
    );
  };

  // Initiate Courier Return (Persisted)
  const handleReturnRequest = async (vol: ReadingVolume) => {
    setLoadingReturnId(vol._id);
    try {
      await userBookReturnStatusUpdate(vol._id, vol.status);
    } catch {
      // Local fallback
    } finally {
      const updated = requestStoredVolumeReturn(vol._id);
      setShelfVolumes(updated);
      setLoadingReturnId(null);
      toast.success(
        `Prepaid return parcel scheduled for "${vol.bookTitle}". Place volume in moisture barrier sleeve.`
      );
    }
  };

  // Submit Archival Review / Marginalia
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForReview) return;

    if (!reviewComment.trim()) {
      toast.warn("Please write your marginalia reflection before submitting.");
      return;
    }

    setIsSubmittingReview(true);
    const toastId = toast.loading("Cataloging reader marginalia...");

    // Persist to local sanctuary reviews immediately
    try {
      addStoredReview({
        bookId: selectedBookForReview.bookId,
        bookTitle: selectedBookForReview.bookTitle,
        bookImage: selectedBookForReview.bookCover,
        author: selectedBookForReview.author,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
    } catch (storageErr) {
      console.warn("Storage sync notice:", storageErr);
    }

    try {
      await addUserComment({
        rating: reviewRating,
        comment: reviewComment.trim(),
        bookId: selectedBookForReview.bookId,
        bookTitle: selectedBookForReview.bookTitle,
        bookImage: selectedBookForReview.bookCover,
        userEmail: user?.email || "reader@librello.org",
        userName: user?.name || "Sanctuary Reader",
        userId: user?.id,
        userImage: user?.image,
        role: user?.role || "user",
      });
    } catch {
      // Offline fallback
    }

    toast.update(toastId, {
      render: `Marginalia cataloged for "${selectedBookForReview.bookTitle}"! View it on My Reviews.`,
      type: "success",
      isLoading: false,
      autoClose: 2500,
    });

    setSelectedBookForReview(null);
    setReviewComment("");
    setReviewRating(5);
    setIsSubmittingReview(false);
  };


  const calculateDaysRemaining = (dueDateString: string) => {
    const dueTime = new Date(dueDateString).getTime();
    const now = Date.now();
    const diffDays = Math.ceil((dueTime - now) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-8 text-foreground pt-2 w-full font-sans pb-16">
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="editorial-badge !text-[9px]">
              <Sparkles size={10} className="text-primary mr-1" /> Sanctuary Reading Desk
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight">
            My Reading Shelf
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Volumes currently in your possession, reading progress trackers, and 1-click renewal privileges.
          </p>
        </div>

        <Link
          href="/books"
          className="btn-primary self-start md:self-auto text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
        >
          <BookOpen size={14} />
          Borrow New Volume
        </Link>
      </div>

      {/* 2. READING SHELF ANALYTICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Loans</span>
            <BookOpen size={16} className="text-primary" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground">{activeCount}</p>
          <span className="text-[11px] text-muted-foreground">Physical books on desk</span>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pages Absorbed</span>
            <Sparkles size={16} className="text-primary" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground">{totalPagesRead}</p>
          <span className="text-[11px] text-emerald-500 font-medium">Logged across volumes</span>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Return Envelopes</span>
            <Truck size={16} className="text-primary" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground">{returnsQueued}</p>
          <span className="text-[11px] text-muted-foreground">Prepaid mailers ready</span>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Sanctuary Standing</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-serif font-bold text-emerald-500">Tier I</p>
          <span className="text-[11px] text-muted-foreground">Exemplary loan stewardship</span>
        </div>
      </div>

      {/* 3. SHELF VOLUME CARDS */}
      {shelfVolumes.length === 0 ? (
        <div className="border border-dashed border-border rounded-3xl p-14 text-center text-muted-foreground flex flex-col items-center justify-center gap-3 bg-card/20">
          <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center border border-border text-muted-foreground">
            <BookOpen size={22} />
          </div>
          <p className="font-serif font-bold text-foreground text-lg">Your Reading Desk is Open</p>
          <p className="text-xs max-w-sm">
            You do not currently have any physical volumes checked out. Browse the archive to request your next loan.
          </p>
          <Link
            href="/books"
            className="btn-primary text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl mt-2"
          >
            Explore Masterworks
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {shelfVolumes.map((vol) => {
            const pages = vol.totalPages || 300;
            const current = Math.min(pages, vol.currentPage || 0);
            const progressPercent = Math.round((current / pages) * 100);
            const daysLeft = calculateDaysRemaining(vol.dueDate);

            const isDueSoon = daysLeft <= 4;
            const isReturnScheduled = vol.status === "Return Requested";

            return (
              <div
                key={vol._id}
                className="p-6 rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl shadow-sm space-y-6 flex flex-col justify-between group hover:border-primary/40 transition-colors"
              >
                <div className="space-y-5">
                  {/* Top Bar */}
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-28 rounded-2xl overflow-hidden shrink-0 border border-border shadow-md relative group-hover:scale-102 transition-transform">
                      <img
                        src={vol.bookCover}
                        alt={vol.bookTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          {vol.category || "Literature"}
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            isReturnScheduled
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : isDueSoon
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          }`}
                        >
                          {isReturnScheduled
                            ? "Return Pickup Queued"
                            : `${daysLeft} Days Remaining`}
                        </span>
                      </div>

                      <Link
                        href={`/books/${vol.bookId}`}
                        className="font-serif font-bold text-lg text-foreground hover:text-primary transition-colors block line-clamp-1"
                      >
                        {vol.bookTitle}
                      </Link>
                      <p className="text-xs text-muted-foreground">By {vol.author}</p>

                      <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
                        <Calendar size={12} className="text-primary" />
                        <span>Due: {new Date(vol.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reading Progress Bar & Interactive Counter */}
                  <div className="p-4 rounded-2xl bg-card-soft/50 border border-border/70 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <BookOpen size={13} className="text-primary" /> Reading Cadence
                      </span>
                      <span className="font-mono text-muted-foreground">
                        {current} / {pages} pp ({progressPercent}%)
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-2 rounded-full bg-border/60 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Quick increment buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-muted-foreground">Update page count:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateProgress(vol._id, current - 20)}
                          disabled={current <= 0}
                          className="px-2 py-0.5 rounded-lg border border-border bg-card text-[11px] hover:border-primary text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-40"
                        >
                          -20
                        </button>
                        <button
                          onClick={() => handleUpdateProgress(vol._id, current + 20)}
                          disabled={current >= pages}
                          className="px-2 py-0.5 rounded-lg border border-border bg-card text-[11px] hover:border-primary text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-40"
                        >
                          +20
                        </button>
                        <button
                          onClick={() => handleUpdateProgress(vol._id, pages)}
                          className="px-2 py-0.5 rounded-lg border border-primary/30 bg-primary/10 text-[11px] text-primary hover:bg-primary/20 cursor-pointer font-semibold"
                        >
                          Finish Book
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-2 border-t border-border/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => setSelectedBookForReview(vol)}
                    className="p-2.5 px-3.5 rounded-xl border border-border bg-card hover:bg-card-soft text-foreground font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <MessageSquare size={14} className="text-primary" />
                    Record Marginalia
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRenewLoan(vol)}
                      disabled={isReturnScheduled}
                      className="p-2.5 px-3.5 rounded-xl border border-border bg-card hover:bg-card-soft text-foreground font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-colors"
                      title="Add 14 days to your circulation"
                    >
                      <RefreshCw size={13} />
                      Renew (+14d)
                    </button>

                    <button
                      onClick={() => handleReturnRequest(vol)}
                      disabled={isReturnScheduled || loadingReturnId === vol._id}
                      className={`p-2.5 px-4 rounded-xl font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 transition-all ${
                        isReturnScheduled
                          ? "bg-muted text-muted-foreground border border-border cursor-not-allowed"
                          : "btn-primary shadow-sm cursor-pointer"
                      }`}
                    >
                      {loadingReturnId === vol._id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <RotateCcw size={13} />
                      )}
                      {isReturnScheduled ? "Courier Notified" : "Return Book"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. MODAL: RECORD MARGINALIA & REVIEW */}
      {selectedBookForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-card border border-border/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-start border-b border-border/70 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <span className="editorial-badge !text-[9px] mb-0.5">
                    Archival Marginalia
                  </span>
                  <h3 className="text-lg font-serif font-bold text-foreground">
                    Record Reader Impression
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedBookForReview(null)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card-soft border border-border transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-5 text-xs">
              <div className="p-3 rounded-2xl bg-card-soft/40 border border-border flex items-center gap-3">
                <img
                  src={selectedBookForReview.bookCover}
                  alt={selectedBookForReview.bookTitle}
                  className="w-10 h-14 rounded-lg object-cover border border-border shrink-0"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-foreground">
                    {selectedBookForReview.bookTitle}
                  </h4>
                  <p className="text-muted-foreground text-[11px]">
                    By {selectedBookForReview.author}
                  </p>
                </div>
              </div>

              {/* Star Rating Selection */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                  Archival Rating
                </label>
                <div className="flex items-center gap-1.5 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        size={22}
                        className={
                          star <= reviewRating
                            ? "fill-amber-500 text-amber-500"
                            : "text-muted-foreground/40"
                        }
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-foreground ml-2">
                    {reviewRating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Marginalia Impression Text */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                  Your Marginalia & Critique
                </label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Record your reflections on the prose, thematic resonance, and physical reading experience..."
                  className="w-full p-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:border-primary text-xs leading-relaxed"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-2 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedBookForReview(null)}
                  disabled={isSubmittingReview}
                  className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-card-soft text-foreground text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className="btn-primary text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingReview ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  Catalog Marginalia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReadingList;
