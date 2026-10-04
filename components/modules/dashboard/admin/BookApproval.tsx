"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import {
  Check,
  Trash2,
  Clock,
  AlertCircle,
  User,
  Bookmark,
} from "lucide-react";
import DeleteBookModal from "../librarian/DeleteBookModal";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { adminUpdateApprovedStatusById } from "@/lib/actions/admin";
import { isBookDeleted } from "@/lib/storage/sanctuaryStorage";

const AnyButton = Button as any;

const BookApproval = ({ books = [] as any[] }: { books?: any[] }) => {
  const router = useRouter();
  const [bookList, setBookList] = useState<any[]>(() => {
    const raw = Array.isArray(books) ? books : [];
    return raw.filter((b) => !isBookDeleted(b._id || b.id));
  });

  React.useEffect(() => {
    const raw = Array.isArray(books) ? books : [];
    setBookList(raw.filter((b) => !isBookDeleted(b._id || b.id)));

    const handleStorage = () => {
      setBookList((prev) => prev.filter((b) => !isBookDeleted(b._id || b.id)));
    };
    window.addEventListener("sanctuary_storage_updated", handleStorage);
    return () => window.removeEventListener("sanctuary_storage_updated", handleStorage);
  }, [books]);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // approved status change
  const handleApprove = async (bookId, status) => {
    try {
      const res = await adminUpdateApprovedStatusById({
        bookId,
        status,
      });
      if (res?.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to update status.");
      }
    } catch (error) {
      toast.error("Something went wrong while approving the book ");
    }
  };

  //  AnimatePresence motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };
  // motion
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  //   Delete Book Modal
  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setIsDeleteOpen(true);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 font-urbanist p-4 md:p-6 text-foreground"
    >
      {/* Header section */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center border-b border-border/40 pb-4"
      >
        <div>
          <h2 className="text-2xl font-bold font-poppins flex items-center gap-2">
            Book Approval Queue <Clock size={22} className="text-amber-500" />
          </h2>
          <p className="text-lg sm:text-base text-muted-foreground">
            Review and authorize incoming librarian listings before public
            distribution.
          </p>
        </div>
        {/* bookmark decoration */}
        <div className="absolute top-0 right-12 w-8 h-16 bg-primary/20 border-x border-b border-primary/30 rounded-b-xl flex items-end justify-center pb-2 text-primary">
          <Bookmark size={14} className="fill-current" />
        </div>
      </motion.div>

      {bookList.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="border border-border bg-card/40 rounded-3xl p-10 text-center text-muted-foreground flex flex-col items-center justify-center gap-2 shadow-sm"
        >
          <AlertCircle size={32} className="text-muted-foreground/60" />
          <p className="font-bold">Queue is Completely Clear!</p>
          <p className="text-base sm:text-sm">
            No books are currently awaiting administrative authorization.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Desktop View */}
          <motion.div
            variants={itemVariants}
            className="hidden md:block border border-border bg-card/30 rounded-3xl shadow-sm overflow-x-auto"
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground text-base sm:text-sm font-semibold uppercase tracking-wider border-b border-border">
                  <th className="p-4">Book Details</th>
                  <th className="p-4">Librarian</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4 text-center">Authorization Actions</th>
                </tr>
              </thead>
              <motion.tbody className="divide-y divide-border/60 text-lg sm:text-base font-medium">
                <AnimatePresence>
                  {bookList.map((book) => (
                    <motion.tr
                      layout
                      key={book._id}
                      variants={itemVariants}
                      whileHover={{
                        backgroundColor: "rgba(var(--muted), 0.1)",
                      }}
                      className="transition-all"
                    >
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-15 h-15 rounded-full flex-shrink-0 object-cover border border-border"
                        />
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-foreground text-lg sm:text-base font-poppins truncate max-w-[220px]">
                            {book.title}
                          </h4>
                          <p className="text-base sm:text-sm text-muted-foreground truncate max-w-[220px]">
                            by {book.author}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-primary/70" />
                          {book.librarianName || "Librarian"}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 text-base sm:text-sm font-bold font-poppins uppercase tracking-wider">
                          {book.category}
                        </span>
                      </td>
                      <td className="p-4 font-poppins font-bold">
                        ${book.fee?.toFixed(2) || "0.00"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <AnyButton
                            size="sm"
                            onClick={() => handleApprove(book._id, book.status)}
                            className="bg-emerald-500 text-white font-bold rounded-xl text-base sm:text-sm uppercase font-poppins tracking-wider h-9 cursor-pointer"
                            startContent={<Check size={14} strokeWidth={3} />}
                          >
                            Approve
                          </AnyButton>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteClick(book)}
                            className="p-2.5 text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </motion.tbody>
            </table>
          </motion.div>

          {/* Mobile View */}
          <div className="block md:hidden space-y-4">
            <AnimatePresence>
              {bookList.map((book) => (
                <motion.div
                  layout
                  key={book._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  variants={itemVariants}
                  className="border border-border bg-card/50 rounded-2xl p-4 shadow-sm space-y-4"
                >
                  <div className="flex gap-3">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-18 h-18 rounded-full object-cover flex-shrink-0 border border-border"
                    />
                    <div className="overflow-hidden flex-1 space-y-1">
                      <h4 className="font-bold text-foreground text-lg sm:text-base font-poppins truncate">
                        {book.title}
                      </h4>
                      <p className="text-base sm:text-sm text-muted-foreground truncate">
                        by {book.author}
                      </p>
                      <div className="flex flex-wrap gap-1.5 items-center pt-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                          {book.category}
                        </span>
                        <span className="text-base sm:text-sm font-bold text-foreground font-poppins ml-auto">
                          ${book.fee?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/40 pt-3 flex items-center justify-between text-base sm:text-sm text-muted-foreground font-semibold">
                    <span className="flex items-center gap-1">
                      <User size={13} /> {book.librarianName || "Librarian"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <AnyButton
                      size="sm"
                      onClick={() => handleApprove(book._id, book.status)}
                      className="flex-1 bg-emerald-500 text-white font-bold rounded-xl text-base sm:text-sm uppercase font-poppins tracking-wider h-10"
                      startContent={<Check size={14} strokeWidth={3} />}
                    >
                      Approve
                    </AnyButton>
                    <AnyButton
                      size="sm"
                      onClick={() => handleDeleteClick(book)}
                      className="bg-red-500/10 text-red-500 border border-red-500/20 font-bold rounded-xl text-base sm:text-sm uppercase font-poppins tracking-wider h-10 px-4"
                    >
                      <Trash2 size={14} />
                    </AnyButton>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      <DeleteBookModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setBookToDelete(null);
        }}
        bookToDelete={bookToDelete}
        onDeleteSuccess={(deletedId) => {
          if (deletedId) {
            setBookList((prev) => prev.filter((b) => b._id !== deletedId && b.id !== deletedId));
          }
          setIsDeleteOpen(false);
          setBookToDelete(null);
          router.refresh();
        }}
      />
    </motion.div>
  );
};

export default BookApproval;
