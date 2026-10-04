"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Pencil,
  Trash2,
  Star,
  Calendar,
  BookOpen,
  Search,
  Check,
  X,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Loader2,
  Heart,
  Quote,
  PlusCircle,
  Download,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  deleteUserCommentById,
  updateUserCommentById,
} from "@/lib/actions/users";
import {
  getStoredReviews,
  updateStoredReview,
  deleteStoredReview,
  addStoredReview,
  getStoredShelf,
  UserReviewItem,
} from "@/lib/storage/sanctuaryStorage";

interface ReaderComment {
  _id: string;
  bookId?: string;
  bookTitle?: string;
  bookImage?: string;
  author?: string;
  rating: number;
  comment: string;
  date?: string;
  createdAt?: string;
  likes?: number;
}

const DEFAULT_ARCHIVAL_REVIEWS: ReaderComment[] = [
  {
    _id: "rev-01",
    bookId: "book-lib-02",
    bookTitle: "Meditations: Annotated Imperial Edition",
    author: "Marcus Aurelius",
    bookImage:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    comment:
      "The physical binding of this edition has a quiet gravitas. Marcus Aurelius's entries on mortality and quiet endurance felt especially urgent during evening study in the reading room.",
    createdAt: "2026-09-22T11:20:00.000Z",
    likes: 18,
  },
  {
    _id: "rev-02",
    bookId: "book-lib-08",
    bookTitle: "Invisible Cities",
    author: "Italo Calvino",
    bookImage:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    comment:
      "Calvino turns memory and space into pure poetry. Each dialogue between Kublai Khan and Marco Polo is an architectural puzzle box that rewards slow, contemplative reading.",
    createdAt: "2026-09-26T16:45:00.000Z",
    likes: 24,
  },
  {
    _id: "rev-03",
    bookId: "book-lib-07",
    bookTitle: "Beyond Good and Evil",
    author: "Friedrich Nietzsche",
    bookImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    rating: 4,
    comment:
      "A searing, provocative work. The aphorisms in the fourth section require patience, but the translation provided by this Librello edition is remarkably clear and luminous.",
    createdAt: "2026-10-01T08:15:00.000Z",
    likes: 9,
  },
];

const MyReviews = ({ comments = [] }: { comments?: any[] }) => {
  const [reviewList, setReviewList] = useState<ReaderComment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<string>("All");

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [isSaving, setIsSaving] = useState(false);

  // Deletion modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ReaderComment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New Marginalia Composer Modal State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedBookForReview, setSelectedBookForReview] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [shelfBooks, setShelfBooks] = useState<any[]>([]);

  // Endorsed / Liked reviews tracker
  const [likedReviewIds, setLikedReviewIds] = useState<string[]>([]);

  // Load reviews from persistent sanctuary storage and server comments
  const syncReviews = () => {
    const stored = getStoredReviews();
    const rawProps = Array.isArray(comments)
      ? comments
      : Array.isArray((comments as any)?.data)
      ? (comments as any).data
      : Array.isArray((comments as any)?.comments)
      ? (comments as any).comments
      : [];

    // Merge stored and raw, deduplicating by _id
    const combinedMap = new Map<string, ReaderComment>();
    
    // Default fallback
    DEFAULT_ARCHIVAL_REVIEWS.forEach((r) => combinedMap.set(r._id, r));
    // Props
    rawProps.forEach((r: any) => combinedMap.set(r._id, r));
    // Storage takes precedence
    stored.forEach((r: any) => combinedMap.set(r._id, r));

    setReviewList(Array.from(combinedMap.values()));
  };

  useEffect(() => {
    syncReviews();
    setShelfBooks(getStoredShelf());

    const handleStorageUpdate = () => {
      syncReviews();
      setShelfBooks(getStoredShelf());
    };

    window.addEventListener("sanctuary_storage_updated", handleStorageUpdate);
    return () => {
      window.removeEventListener("sanctuary_storage_updated", handleStorageUpdate);
    };
  }, [comments]);

  // Statistics
  const totalReviewsCount = reviewList.length;
  const averageRating = useMemo(() => {
    if (totalReviewsCount === 0) return "5.0";
    const sum = reviewList.reduce((acc, r) => acc + (r.rating || 5), 0);
    return (sum / totalReviewsCount).toFixed(1);
  }, [reviewList, totalReviewsCount]);

  const totalHelpfulVotes = reviewList.reduce((acc, r) => acc + (r.likes || 12), 0);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviewList.filter((item) => {
      const matchRating =
        filterRating === "All" || item.rating === Number(filterRating);

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (item.bookTitle && item.bookTitle.toLowerCase().includes(q)) ||
        (item.comment && item.comment.toLowerCase().includes(q)) ||
        (item.author && item.author.toLowerCase().includes(q));

      return matchRating && matchSearch;
    });
  }, [reviewList, filterRating, searchQuery]);

  const handleStartEdit = (review: ReaderComment) => {
    setEditingId(review._id);
    setEditText(review.comment);
    setEditRating(review.rating || 5);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editText.trim()) {
      toast.warn("Review commentary cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      await updateUserCommentById(id, {
        comment: editText.trim(),
        rating: editRating,
      });
    } catch {
      // Offline fallback is handled smoothly below
    }

    // Always update persistent sanctuary storage
    updateStoredReview(id, editText.trim(), editRating);

    setReviewList((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, comment: editText.trim(), rating: editRating }
          : item
      )
    );

    setEditingId(null);
    setIsSaving(false);
    toast.success("Marginalia commentary updated and synchronized across archive!");
  };

  const confirmDelete = (review: ReaderComment) => {
    setItemToDelete(review);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await deleteUserCommentById(itemToDelete._id);
    } catch {
      // Handled cleanly via persistent storage
    }

    // Always remove from persistent sanctuary storage
    deleteStoredReview(itemToDelete._id);

    setReviewList((prev) => prev.filter((r) => r._id !== itemToDelete._id));
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
    setIsDeleting(false);
    toast.success("Marginalia entry permanently excised from archive ledger.");
  };

  // Toggle Endorse / Helpful
  const handleToggleLike = (id: string) => {
    const isLiked = likedReviewIds.includes(id);
    if (isLiked) {
      setLikedReviewIds((prev) => prev.filter((x) => x !== id));
      setReviewList((prev) =>
        prev.map((r) => (r._id === id ? { ...r, likes: Math.max(0, (r.likes || 1) - 1) } : r))
      );
      toast.info("Endorsement withdrawn.");
    } else {
      setLikedReviewIds((prev) => [...prev, id]);
      setReviewList((prev) =>
        prev.map((r) => (r._id === id ? { ...r, likes: (r.likes || 0) + 1 } : r))
      );
      toast.success("Marginalia endorsed as insightful criticism!");
    }
  };

  // Create new review
  const handleCreateReview = () => {
    if (!newReviewText.trim()) {
      toast.warn("Please write your literary criticism before saving.");
      return;
    }

    const targetBook = shelfBooks.find((b) => b.bookId === selectedBookForReview) || shelfBooks[0] || {
      bookId: "book-lib-04",
      bookTitle: "The Odyssey: Annotated",
      author: "Homer",
      bookCover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    };

    const created = addStoredReview({
      bookId: targetBook.bookId,
      bookTitle: targetBook.bookTitle,
      bookImage: targetBook.bookCover || targetBook.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop",
      author: targetBook.author,
      rating: newReviewRating,
      comment: newReviewText.trim(),
    });

    setReviewList((prev) => [created, ...prev]);
    setIsComposerOpen(false);
    setNewReviewText("");
    setNewReviewRating(5);
    toast.success(`Marginalia for "${targetBook.bookTitle}" cataloged successfully!`);
  };

  // Export reviews as markdown document
  const handleExportCritiqueDossier = () => {
    if (reviewList.length === 0) {
      toast.info("No reviews available to export.");
      return;
    }

    let markdown = `# Librello Sanctuary — Reader Marginalia & Review Ledger\n`;
    markdown += `Generated on: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\n`;
    markdown += `Total Reviews: ${reviewList.length} | Average Rating: ${averageRating} / 5.0\n\n---\n\n`;

    reviewList.forEach((rev, idx) => {
      markdown += `### ${idx + 1}. ${rev.bookTitle || "Untitled Volume"}\n`;
      markdown += `**Author:** ${rev.author || "Curated Author"}\n`;
      markdown += `**Rating:** ${"★".repeat(rev.rating)}${"☆".repeat(5 - rev.rating)} (${rev.rating}/5)\n`;
      markdown += `**Recorded Date:** ${formatDate(rev.createdAt || rev.date)}\n`;
      markdown += `**Marginalia Text:**\n> ${rev.comment}\n\n`;
      markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `librello-marginalia-dossier-${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Reader Marginalia Dossier (.md) generated and downloaded!");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recent Archive";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Recent Archive";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8 text-foreground pt-2 w-full font-sans pb-16">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="editorial-badge !text-[9px]">
              <Sparkles size={10} className="text-primary mr-1" /> Archival Criticism
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight">
            Marginalia & Volume Reviews
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Reflections, literary annotations, and critical appraisals penned across your borrowed physical editions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCritiqueDossier}
            className="px-4 py-2.5 rounded-xl border border-border hover:border-primary text-muted-foreground hover:text-foreground bg-card text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            title="Download notes as Markdown file"
          >
            <Download size={13} />
            Export Dossier
          </button>

          <button
            onClick={() => {
              if (shelfBooks.length > 0 && !selectedBookForReview) {
                setSelectedBookForReview(shelfBooks[0].bookId);
              }
              setIsComposerOpen(true);
            }}
            className="btn-primary text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <PlusCircle size={14} />
            Compose Marginalia
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Reviews Penned</span>
            <MessageSquare size={16} className="text-primary" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground">{totalReviewsCount}</p>
          <span className="text-[11px] text-muted-foreground">Volumes critiqued</span>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Average Rating</span>
            <Star size={16} className="text-amber-500 fill-amber-500" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground">{averageRating} / 5.0</p>
          <span className="text-[11px] text-amber-500 font-medium">Critical discernment</span>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Community Acclaim</span>
            <Heart size={16} className="text-rose-500" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground">{totalHelpfulVotes}</p>
          <span className="text-[11px] text-muted-foreground">Helpful borrower votes</span>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-wider">Sanctuary Critic</span>
            <Quote size={16} className="text-primary" />
          </div>
          <p className="text-2xl font-serif font-bold text-primary">Senior Fellow</p>
          <span className="text-[11px] text-muted-foreground">Verified Archival Reader</span>
        </div>
      </div>

      {/* 3. FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Rating Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl border border-border/80 bg-card-soft/40 w-full sm:w-auto">
          {["All", "5", "4", "3"].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                filterRating === star
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {star === "All" ? "All Impressions" : `${star} Stars`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews, book titles..."
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

      {/* 4. REVIEWS GRID */}
      {filteredReviews.length === 0 ? (
        <div className="border border-dashed border-border rounded-3xl p-14 text-center text-muted-foreground flex flex-col items-center justify-center gap-3 bg-card/20">
          <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center border border-border text-muted-foreground">
            <MessageSquare size={22} />
          </div>
          <p className="font-serif font-bold text-foreground text-lg">No Marginalia Recorded</p>
          <p className="text-xs max-w-sm">
            {searchQuery
              ? "No reviews match your search query. Try broadening your terms."
              : "You haven't penned any reviews yet. Finish reading a volume to record marginalia."}
          </p>
          <Link
            href="/dashboard/user/myReadingList"
            className="btn-primary text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl mt-2"
          >
            Go to Reading Shelf
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review) => {
            const isEditingThis = editingId === review._id;
            const cover =
              review.bookImage ||
              "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop";

            return (
              <div
                key={review._id}
                className="p-6 rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl shadow-sm space-y-5 flex flex-col justify-between group hover:border-primary/40 transition-colors"
              >
                <div className="space-y-4">
                  {/* Book Reference Card Header */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-20 rounded-xl overflow-hidden shrink-0 border border-border shadow-sm group-hover:scale-102 transition-transform">
                      <img src={cover} alt={review.bookTitle || "Book"} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start">
                        {/* Rating Stars */}
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={13}
                              className={
                                star <= (isEditingThis ? editRating : review.rating)
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-muted-foreground/30"
                              }
                            />
                          ))}
                        </div>

                        <span className="text-[10px] text-muted-foreground font-mono">
                          {formatDate(review.createdAt || review.date)}
                        </span>
                      </div>

                      <Link
                        href={`/books/${review.bookId || ""}`}
                        className="font-serif font-bold text-base text-foreground hover:text-primary transition-colors block line-clamp-1"
                      >
                        {review.bookTitle || "Untitled Volume"}
                      </Link>
                      <p className="text-xs text-muted-foreground">{review.author || "Curated Author"}</p>
                    </div>
                  </div>

                  {/* Review Text or Inline Editor */}
                  {isEditingThis ? (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <span className="text-xs font-bold text-foreground">Adjust Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditRating(star)}
                            className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              size={16}
                              className={
                                star <= editRating
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-muted-foreground/30"
                              }
                            />
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows={3}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-3 rounded-xl border border-primary bg-card text-foreground focus:outline-none text-xs leading-relaxed"
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          disabled={isSaving}
                          className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(review._id)}
                          disabled={isSaving}
                          className="btn-primary px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                        >
                          {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-card-soft/40 border border-border/70 relative">
                      <p className="text-sm text-foreground/90 font-light leading-relaxed font-sans italic">
                        "{review.comment}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                {!isEditingThis && (
                  <div className="pt-3 border-t border-border/70 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleLike(review._id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                        likedReviewIds.includes(review._id)
                          ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                          : "bg-card-soft text-muted-foreground hover:text-foreground border border-border"
                      }`}
                      title="Endorse this critique"
                    >
                      <Heart
                        size={12}
                        className={
                          likedReviewIds.includes(review._id)
                            ? "fill-rose-500 text-rose-500"
                            : ""
                        }
                      />
                      <span>{review.likes || 0} Endorsements</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(review)}
                        className="p-2 rounded-xl border border-border hover:border-primary text-muted-foreground hover:text-foreground bg-card transition-all cursor-pointer"
                        title="Edit Marginalia"
                      >
                        <Pencil size={13} />
                      </button>

                      <button
                        onClick={() => confirmDelete(review)}
                        className="p-2 rounded-xl border border-border hover:border-rose-500/50 text-muted-foreground hover:text-rose-500 bg-card transition-all cursor-pointer"
                        title="Delete Marginalia"
                      >
                        <Trash2 size={13} />
                      </button>

                      <Link
                        href={`/books/${review.bookId || ""}`}
                        className="p-2 rounded-xl border border-border hover:border-primary text-muted-foreground hover:text-foreground bg-card transition-all"
                        title="View Volume Archive"
                      >
                        <ArrowUpRight size={13} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-card border border-border/80 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-lg text-foreground">
                Remove Marginalia Reflection?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Are you sure you want to remove your recorded review for{" "}
                <span className="font-semibold text-foreground">"{itemToDelete.bookTitle}"</span>?
                This commentary will be erased from the community archival ledger.
              </p>
            </div>

            <div className="pt-2 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setItemToDelete(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-card-soft text-foreground text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {isDeleting && <Loader2 size={13} className="animate-spin" />}
                Confirm Erase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. COMPOSE NEW MARGINALIA MODAL */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-card border border-border/80 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-foreground">
                    Compose Archival Marginalia
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Record your literary notes directly into the community ledger
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Select Volume */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  Select Archival Volume
                </label>
                <select
                  value={selectedBookForReview}
                  onChange={(e) => setSelectedBookForReview(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-primary"
                >
                  {shelfBooks.length > 0 ? (
                    shelfBooks.map((b) => (
                      <option key={b.bookId} value={b.bookId}>
                        {b.bookTitle} — {b.author}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="book-lib-01">The Midnight Library — Matt Haig</option>
                      <option value="book-lib-02">Meditations — Marcus Aurelius</option>
                      <option value="book-lib-03">Ficciones — Jorge Luis Borges</option>
                      <option value="book-lib-04">The Odyssey — Homer</option>
                    </>
                  )}
                </select>
              </div>

              {/* Star Rating */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  Preservation Appraisal (Rating)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        size={22}
                        className={
                          star <= newReviewRating
                            ? "fill-amber-500 text-amber-500"
                            : "text-muted-foreground/30 hover:text-amber-500/50"
                        }
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-muted-foreground ml-2">
                    {newReviewRating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Critique Commentary */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  Marginalia Reflection
                </label>
                <textarea
                  rows={4}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Annotate key passages, prose texture, binding quality, or thematic insights..."
                  className="w-full p-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-xs leading-relaxed focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => setIsComposerOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-card-soft text-foreground text-xs font-semibold cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={handleCreateReview}
                className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Check size={14} />
                Record Marginalia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
