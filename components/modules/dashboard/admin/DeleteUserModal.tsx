"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { AlertTriangle, X } from "lucide-react";
import { toast } from "react-toastify";
import { deleteUserById } from "@/lib/actions/users";

const AnyButton = Button as any;

const DeleteUserModal = ({
  isOpen,
  onClose,
  userToDelete,
  onDeleteSuccess,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  userToDelete?: any;
  onDeleteSuccess?: () => void;
}) => {
  //  Deleting loading state control korar jonno
  const [isDeleting, setIsDeleting] = useState(false);

  //  Delete confirm button e click korle eta chalbe
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteUserById(userToDelete._id);

      if (res?.success) {
        toast.success(
          `"${userToDelete.name}" account has been permanently deleted! `,
        );
        if (onDeleteSuccess) onDeleteSuccess();
        onClose();
      } else {
        toast.error(res?.message || "Failed to delete the user.");
      }
    } catch (error) {
      toast.error("Failed to delete the user account.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40 dark:bg-black/60 transition-all">
      <div className="dashboard-card max-w-md w-full border border-border p-6 rounded-3xl shadow-2xl relative bg-card text-foreground">
        {/*  Modal bondho korar cross button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          {/*  Red Danger Warning Icon */}
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertTriangle size={32} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold font-poppins text-foreground">
              Confirm Permanent Delete
            </h3>
            <p className="text-lg sm:text-base text-muted-foreground px-2">
              Are you absolutely sure you want to delete user{" "}
              <span className="text-primary font-semibold">
                {userToDelete?.name}{" "}
                {/*  Ekhan e user er name ta live show korbe */}
              </span>
              ? This action cannot be undone.
            </p>
          </div>

          {/*  Bottom Action Buttons (Cancel and Confirm) */}
          <div className="flex items-center justify-center gap-3 w-full pt-4 border-t border-border/40">
            {/*  Cancel button, eitay click korle modal close hobe */}
            <AnyButton
              onClick={onClose}
              variant="flat"
              className="btn-secondary h-11 px-5 font-bold text-lg sm:text-base cursor-pointer flex-1"
            >
              Cancel
            </AnyButton>

            {/*  Yes, Delete button, eitay click korle user database theke delete hobe */}
            <AnyButton
              onClick={handleConfirmDelete}
              isLoading={isDeleting} //  Loading thakle spinner ghurbe automatically
              className="bg-red-500 hover:bg-red-600 text-white h-11 px-5 font-bold text-lg sm:text-base cursor-pointer flex-1 rounded-xl active:scale-95 transition-all shadow-md shadow-red-500/10"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </AnyButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
