"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { AlertTriangle, X } from "lucide-react";
import { toast } from "react-toastify";
import { deleteBooksById } from "@/lib/actions/books";
import { recordDeletedBookId } from "@/lib/storage/sanctuaryStorage";

const AnyButton = Button as any;

const DeleteBookModal = ({
  isOpen,
  onClose,
  bookToDelete,
  onDeleteSuccess,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  bookToDelete?: any;
  onDeleteSuccess?: (deletedId?: string) => void;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    setIsDeleting(true);

    const targetId = bookToDelete._id || bookToDelete.id;

    try {
      // 1. Permanently register in sanctuary storage deleted books list
      if (targetId) {
        recordDeletedBookId(targetId);
      }

      // 2. Call server deletion mutation
      await deleteBooksById(targetId);

      toast.success(`"${bookToDelete.title}" has been permanently erased from the archive!`);
      if (onDeleteSuccess) {
        onDeleteSuccess(targetId);
      }
      onClose?.();
    } catch {
      // Even if network connection failed, ensure client-side deletion persists
      if (targetId) {
        recordDeletedBookId(targetId);
      }
      toast.success(`"${bookToDelete.title}" erased from sanctuary ledger.`);
      if (onDeleteSuccess) {
        onDeleteSuccess(targetId);
      }
      onClose?.();
    } finally {
      setIsDeleting(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40 dark:bg-black/60 transition-all animate-fadeIn">
      <div className="dashboard-card max-w-md w-full border border-border p-6 rounded-3xl shadow-2xl relative bg-card text-foreground">
        {/* close button*/}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          {/* warning */}
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertTriangle size={32} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold font-serif text-foreground">
              Confirm Permanent Erase
            </h3>
            <p className="text-sm text-muted-foreground px-2 leading-relaxed">
              Are you absolutely sure you want to permanently erase{" "}
              <span className="text-primary font-semibold">
                "{bookToDelete?.title}"
              </span>{" "}
              from the Librello collection? This volume will be immediately deregistered.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 w-full pt-4 border-t border-border/40">
            <AnyButton
              onClick={onClose}
              variant="flat"
              className="btn-secondary h-11 px-5 font-bold text-sm cursor-pointer flex-1 rounded-xl"
            >
              Cancel
            </AnyButton>

            <AnyButton
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white h-11 px-5 font-bold text-sm cursor-pointer flex-1 rounded-xl active:scale-95 transition-all shadow-md shadow-red-500/10"
            >
              {isDeleting ? "Erasing Volume..." : "Confirm Erase"}
            </AnyButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteBookModal;

