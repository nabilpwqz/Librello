"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import EditBookModal from "../dashboard/librarian/EditBookModal";
import { useRouter } from "next/navigation";
import DeleteBookModal from "../dashboard/librarian/DeleteBookModal";
import DeletedAssetScreen from "./DeletedAssetScreen";

import { toast } from "react-toastify";
import Loader from "../shared/Loader";
import { toggleBooksStatusById } from "@/lib/actions/librarian";
import AIInsightsCard from "./AIInsightsCard";
import CirculationRequestModal from "./CirculationRequestModal";
import {
  isBookmarked as checkIsBookmarked,
  toggleStoredBookmark,
  isBookDeleted,
} from "@/lib/storage/sanctuaryStorage";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  Heart,
  Layers,
  MapPin,
  Package,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  User,
} from "lucide-react";

const SubmitButton: any = Button;

export default function BookDetails({
  books,
  userComments = [],
}: {
  books?: any;
  userComments?: any;
}) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCirculationModalOpen, setIsCirculationModalOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const loggedInUser = session?.user;

  // Safe reviews array normalization
  const reviews = Array.isArray(userComments)
    ? userComments
    : Array.isArray((userComments as any)?.data)
    ? (userComments as any).data
    : Array.isArray((userComments as any)?.comments)
    ? (userComments as any).comments
    : [];

  const formattedDate = books?.createdAt
    ? new Date(books.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Archived Collection";

  const coverUrl =
    books?.cover ||
    books?.coverImage ||
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop";

  if (isPending) return <Loader />;
  if (isDeleted || !books) return <DeletedAssetScreen />;

  const isOwnerLibrarian = loggedInUser?.email === books?.librarianEmail;
  const isBookCheckedOut = books?.status === "Checked Out";

  const handleEditClick = (book: any) => {
    setSelectedBook(book);
    setIsEditing(true);
  };

  const handleDeleteClick = (book: any) => {
    setBookToDelete(book);
    setIsDeleteOpen(true);
  };

  const handleToggleStatus = async (bookId: string, currentStatus: string) => {
    try {
      const result = await toggleBooksStatusById({ bookId, currentStatus });
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleOpenCirculation = () => {
    if (!loggedInUser) {
      toast.info("Please sign in to borrow this physical volume");
      router.push(`/signin?callbackUrl=/books/${books?._id}`);
      return;
    }
    setIsCirculationModalOpen(true);
  };

  const handleShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Archival link copied to clipboard!");
    }
  };

  useEffect(() => {
    if (books?._id) {
      setIsBookmarked(checkIsBookmarked(books._id));
      if (isBookDeleted(books._id)) {
        setIsDeleted(true);
      }
    }
  }, [books?._id]);

  const toggleBookmark = () => {
    if (!books?._id) return;
    const nowBookmarked = toggleStoredBookmark(books._id);
    setIsBookmarked(nowBookmarked);
    toast.info(
      nowBookmarked
        ? "Saved volume to your sanctuary reading shelf"
        : "Removed volume from reading shelf"
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 font-sans">
      {/* Navigation & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-all group cursor-pointer"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Return to Archive
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleBookmark}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-medium ${
              isBookmarked
                ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                : "border-border bg-card/60 hover:bg-card-soft text-muted-foreground hover:text-foreground"
            }`}
            title="Bookmark Volume"
          >
            <Heart
              size={15}
              className={isBookmarked ? "fill-rose-500" : ""}
            />
            <span className="hidden sm:inline">
              {isBookmarked ? "On Shelf" : "Save to Shelf"}
            </span>
          </button>

          <button
            onClick={handleShareLink}
            className="p-2.5 rounded-xl border border-border bg-card/60 hover:bg-card-soft text-muted-foreground hover:text-foreground transition-all cursor-pointer flex items-center gap-2 text-xs font-medium"
            title="Share Volume Link"
          >
            <Share2 size={15} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Main Book Detail Spread */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-3xl overflow-hidden border border-border/80 bg-card/70 backdrop-blur-xl shadow-xl"
      >
        {/* Ambient Glow Backdrop */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[100px] pointer-events-none"
        />

        {/* Left Side: Hardcover Book Cover Presentation Frame */}
        <div className="lg:col-span-5 relative min-h-[420px] md:min-h-[560px] flex flex-col items-center justify-center p-8 md:p-12 bg-card-soft/30 overflow-hidden border-b lg:border-b-0 lg:border-r border-border/70">
          {/* Subtle Blurred Background Cover */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-125 blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundImage: `url(${coverUrl})` }}
          />

          {/* Archival Edition Seal */}
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-background/80 backdrop-blur-md border border-border text-foreground/80 flex items-center gap-1.5 shadow-sm">
              <Sparkles size={11} className="text-primary" />
              Archival Hardcover
            </span>
          </div>

          {/* Book Spine & Jacket Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="w-full aspect-[3/4.4] max-w-[320px] rounded-2xl overflow-hidden bg-card border border-border/80 shadow-2xl z-10 relative group"
          >
            {/* Book Spine simulated lighting */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-20 pointer-events-none" />
            <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-white/20 z-20 pointer-events-none" />

            <img
              src={coverUrl}
              alt={books?.title || "Book Edition"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Availability Overlay Ribbon */}
            <div className="absolute bottom-3 right-3 z-20">
              <span
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md border ${
                  !isBookCheckedOut
                    ? "bg-emerald-500/90 text-white border-emerald-400/30"
                    : "bg-zinc-800/90 text-zinc-300 border-zinc-700/50"
                }`}
              >
                {!isBookCheckedOut ? "In Archive Available" : "On Reading Loan"}
              </span>
            </div>
          </motion.div>

          <p className="mt-6 text-[11px] font-medium text-muted-foreground tracking-wide text-center z-10">
            Physical Edition • Shelf {books?.shelfLocation || "Sanctuary A-12"} • {books?.stock || 4} Copies in Stacks
          </p>
        </div>

        {/* Right Side: Editorial Information & Circulation Panel */}
        <div className="lg:col-span-7 p-6 md:p-12 flex flex-col justify-between relative z-10 space-y-8">
          <div className="space-y-6">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                  {books?.category || "Archival Literature"}
                </span>

                <span className="px-2.5 py-1 rounded-lg bg-card-soft text-foreground/80 text-[10px] font-semibold border border-border">
                  {books?.year || 2021} Edition
                </span>
              </div>

              {/* Rating & Circulation Count */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star size={14} className="fill-amber-500" />
                  <span>{books?.rating ? Number(books.rating).toFixed(1) : "4.9"}</span>
                  <span className="text-muted-foreground font-normal">
                    ({books?.reviewsCount || reviews.length || 120} reviews)
                  </span>
                </div>

                <span className="text-border">•</span>

                <div className="text-muted-foreground text-xs font-medium">
                  <span className="text-foreground font-bold">
                    {books?.requests || 24}
                  </span>{" "}
                  readers borrowed
                </div>
              </div>
            </div>

            {/* Title & Author */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground tracking-tight leading-tight">
                {books?.title || "Untitled Masterwork"}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                <span>By</span>
                <span className="text-foreground font-semibold text-base font-serif">
                  {books?.author || "Classical Author"}
                </span>
                <CheckCircle2 size={15} className="text-primary ml-0.5" />
              </div>
            </div>

            {/* Synopsis */}
            <div className="pt-4 border-t border-border/60 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                  Volume Synopsis & Annotation
                </span>
              </div>
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-sans font-light">
                {books?.description ||
                  "No synopsis recorded for this cataloged volume. Consult the sanctuary curator for physical annotations and historical provenance."}
              </p>
            </div>

            {/* AI Insights Card */}
            <AIInsightsCard book={books} />

            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/60">
              <div className="p-3 rounded-xl bg-card-soft/50 border border-border/60">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">
                  Pages
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {books?.pages || 320} pp
                </span>
              </div>

              <div className="p-3 rounded-xl bg-card-soft/50 border border-border/60">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">
                  Publisher
                </span>
                <span className="text-sm font-semibold text-foreground truncate block">
                  {books?.publisher || "Librello Press"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-card-soft/50 border border-border/60">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">
                  ISBN-13
                </span>
                <span className="text-xs font-mono font-semibold text-foreground truncate block">
                  {books?.isbn || "LIB-978-01995"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-card-soft/50 border border-border/60">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">
                  Cataloged
                </span>
                <span className="text-xs font-semibold text-foreground block">
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Curator In Charge Banner */}
            <div className="p-4 rounded-2xl bg-card-soft/40 border border-border/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    books?.librarianImage ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                  }
                  alt={books?.librarianName || "Curator"}
                  className="w-11 h-11 rounded-full object-cover border border-primary/30"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">
                      {books?.librarianName || "Curator Evelyn Vance"}
                    </span>
                    <span className="px-1.5 py-0.2 bg-primary/10 text-primary text-[9px] font-bold rounded">
                      Curator
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {books?.librarianEmail || "curator@librello.org"}
                  </span>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">
                  Sanctuary Status
                </span>
                <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Inspected & Ready
                </span>
              </div>
            </div>
          </div>

          {/* Action & Circulation Checkout Section */}
          <div className="space-y-4 pt-4 border-t border-border/80">
            {/* Handling fee & dispatch summary */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">
                  Member Circulation Fee
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-serif font-bold text-foreground">
                    ${books?.fee ? Number(books.fee).toFixed(2) : "0.00"}
                  </span>
                  <span className="text-xs text-muted-foreground">/ 14-day loan</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                <Truck size={14} />
                <span>Prepaid Courier Return Included</span>
              </div>
            </div>

            {/* Action Buttons */}
            {isOwnerLibrarian ? (
              <div className="grid grid-cols-3 gap-3 pt-2 w-full">
                <Button
                  onClick={() => handleEditClick(books)}
                  className="bg-card border border-border h-11 font-bold rounded-xl text-xs uppercase tracking-wider text-foreground hover:border-primary cursor-pointer transition-all"
                >
                  Edit Details
                </Button>

                <Button
                  onClick={() => handleToggleStatus(books?._id, books?.status)}
                  className="h-11 px-3 border border-border bg-card rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer hover:border-primary text-foreground transition-all"
                >
                  {books?.status === "Published" ? "Delist Volume" : "Publish to Archive"}
                </Button>

                <Button
                  onClick={() => handleDeleteClick(books)}
                  className="bg-rose-500/10 text-rose-500 border border-rose-500/20 h-11 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer hover:bg-rose-500/20 transition-all"
                >
                  Delete Record
                </Button>
              </div>
            ) : (
              <div className="w-full">
                <Button
                  onClick={handleOpenCirculation}
                  isDisabled={isBookCheckedOut || isOwnerLibrarian}
                  className={`w-full h-14 text-xs font-bold uppercase tracking-widest transition-all rounded-2xl shadow-lg cursor-pointer flex items-center justify-center gap-2 ${
                    !(isBookCheckedOut || isOwnerLibrarian)
                      ? "btn-primary hover:opacity-95"
                      : "bg-card-soft text-muted-foreground cursor-not-allowed border border-border shadow-none opacity-60"
                  }`}
                >
                  {isBookCheckedOut ? (
                    "Volume Currently on Loan"
                  ) : (
                    <>
                      <BookOpen size={16} />
                      Request Physical Volume Circulation
                    </>
                  )}
                </Button>
              </div>
            )}


            {/* Lending terms guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-primary shrink-0" />
                <span>14-Day Physical Reading Loan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-primary shrink-0" />
                <span>Zero Late Fees on Renewal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-primary shrink-0" />
                <span>Sanctuary Doorstep Courier</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reader Impressions Section */}
      <div className="dashboard-card p-6 md:p-10 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-primary" />
              Reader Impressions & Critical Commentary
            </h3>
            <p className="text-xs text-muted-foreground">
              Community marginalia and reflections from members who have held and read this volume.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
            {reviews.length} Verified Reviews
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-14 border border-dashed border-border/80 rounded-2xl bg-card-soft/30 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center border border-border text-primary/80">
              <BookOpen size={20} />
            </div>
            <p className="text-sm font-semibold text-foreground">
              No reader impressions recorded yet
            </p>
            <p className="text-xs max-w-sm">
              Be the first to borrow this physical volume and record your marginalia for the archive.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviews.map((review: any, idx: number) => (
              <div
                key={review._id || idx}
                className="p-6 rounded-2xl border border-border/70 bg-card-soft/40 space-y-3 shadow-sm hover:border-primary/40 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xs font-bold font-serif">
                      {(review?.userName || "R")[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-foreground block">
                        {review?.userName || "Sanctuary Reader"}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                        {review?.date || "Archival Member"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(Math.min(5, Math.max(1, review?.rating || 5)))].map(
                      (_, i) => (
                        <Star key={i} size={13} className="fill-amber-500" />
                      )
                    )}
                  </div>
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed font-sans font-light pt-1">
                  "{review?.comment || "A remarkable volume that deserves a place in any serious reader's sanctuary."}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Book Modal */}
      <DeleteBookModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setBookToDelete(null);
        }}
        bookToDelete={bookToDelete}
        onDeleteSuccess={() => {
          setIsDeleted(true);
          setIsDeleteOpen(false);
          setBookToDelete(null);
          router.refresh();
        }}
      />

      {/* Edit Book Modal */}
      {selectedBook && isEditing && (
        <EditBookModal
          selectedBook={selectedBook}
          onCancel={() => {
            setIsEditing(false);
            setSelectedBook(null);
          }}
          onUpdateSuccess={() => router.refresh()}
        />
      )}

      {/* Circulation Request Modal */}
      <CirculationRequestModal
        isOpen={isCirculationModalOpen}
        onClose={() => setIsCirculationModalOpen(false)}
        book={books}
        user={loggedInUser}
      />
    </div>
  );
}
