"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { Book, Check, X, Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { adminUpdateStatusById } from "@/lib/actions/admin";
import DeleteBookModal from "../librarian/DeleteBookModal";
import { isBookDeleted } from "@/lib/storage/sanctuaryStorage";

const AnyButton = Button as any;

const ManageBooks = ({ books = [] as any[] }: { books?: any[] }) => {
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

  // Delete book modal state management
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  // Status transition control handler
  const handleStatusClick = async (bookId, targetStatus) => {
    try {
      setLoadingId(bookId);

      // api
      const res = await adminUpdateStatusById({ bookId, status: targetStatus });

      if (res?.success) {
        toast.success(`Book status changed to ${targetStatus}!`);
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setIsDeleteOpen(true);
  };

  // Status configuration badge styles
  const statusStyles = {
    Published: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Unpublished: "bg-red-500/10 text-red-500 border-red-500/20",
    "Pending Approval": "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };

  return (
    <div className="space-y-6 font-urbanist text-foreground pt-4 w-full">
      {/* Empty queue guard layer */}
      {bookList.length === 0 ? (
        <div className="border border-border bg-card/40 rounded-3xl p-10 text-center text-muted-foreground flex flex-col items-center justify-center gap-2 shadow-sm">
          <Book size={32} className="text-muted-foreground/60" />
          <p className="font-bold">No Books Found</p>
        </div>
      ) : (
        /* Platform inventory main table layout */
        <div className="border border-border bg-card/30 rounded-3xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground text-base sm:text-sm font-semibold uppercase tracking-wider border-b border-border">
                <th className="p-4">Book Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60 text-lg sm:text-base font-medium">
              {bookList.map((book) => (
                <tr key={book._id} className="transition-all hover:bg-muted/10">
                  {/* Book cover image and localized title display */}
                  <td className="p-4 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-base sm:text-sm uppercase flex-shrink-0">
                      {book.cover ? (
                        <img
                          src={book?.cover}
                          alt="Book Cover"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        book.title?.charAt(0)
                      )}
                    </div>
                    <span className="font-bold font-poppins text-foreground truncate max-w-[180px]">
                      {book.title}
                    </span>
                  </td>

                  <td className="p-4 text-muted-foreground truncate max-w-[140px]">
                    {book.author || "Unknown Author"}
                  </td>

                  <td className="p-4">
                    {/*Changed px-10 to px-3 to prevent layout breaking on small screens */}
                    <span
                      className={`px-3 py-1 rounded-md text-base sm:text-sm font-bold uppercase border whitespace-nowrap ${statusStyles[book.status] || statusStyles["Pending Approval"]}`}
                    >
                      {book.status || "Pending Approval"}
                    </span>
                  </td>

                  <td className="p-4">
                    {/* Fixed 2-column uniform grid layout to completely lock button alignments */}
                    <div className="grid grid-cols-2 gap-2 w-[190px] mx-auto items-center">
                      {/* Operational workflow actions block */}
                      <div className="flex justify-end w-full">
                        {(book.status === "Pending Approval" ||
                          !book.status) && (
                          <AnyButton
                            size="sm"
                            color="success"
                            variant="flat"
                            isLoading={loadingId === book._id}
                            onClick={() =>
                              handleStatusClick(book._id, "Published")
                            }
                            className="font-bold text-base sm:text-sm rounded-xl h-9 w-full"
                            startContent={<Check size={14} />}
                          >
                            Approve
                          </AnyButton>
                        )}

                        {book.status === "Published" && (
                          <AnyButton
                            size="sm"
                            color="warning"
                            variant="flat"
                            isLoading={loadingId === book._id}
                            onClick={() =>
                              handleStatusClick(book._id, "Unpublished")
                            }
                            className="font-bold text-base sm:text-sm rounded-xl h-9 w-full"
                            startContent={<EyeOff size={14} />}
                          >
                            Unpublish
                          </AnyButton>
                        )}

                        {book.status === "Unpublished" && (
                          <AnyButton
                            size="sm"
                            color="success"
                            variant="flat"
                            isLoading={loadingId === book._id}
                            onClick={() =>
                              handleStatusClick(book._id, "Published")
                            }
                            className="font-bold text-base sm:text-sm rounded-xl h-9 w-full"
                            startContent={<Eye size={14} />}
                          >
                            Publish
                          </AnyButton>
                        )}
                      </div>

                      {/* Explicit destructive removal actions block */}
                      <div className="flex justify-start w-full">
                        <AnyButton
                          size="sm"
                          color="danger"
                          variant="flat"
                          onClick={() => handleDeleteClick(book)}
                          className="text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 font-bold text-base sm:text-sm h-9 w-full"
                          startContent={<Trash2 size={14} />}
                        >
                          Delete
                        </AnyButton>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Persistent inventory removal overlay modal dialog */}
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
    </div>
  );
};

export default ManageBooks;
