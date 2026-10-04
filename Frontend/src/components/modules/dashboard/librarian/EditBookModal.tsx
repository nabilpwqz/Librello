"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { Save, ArrowLeft, RefreshCw, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import { updateBookDetailsById } from "@/lib/actions/books";

const AnyButton = Button as any;

const EditBookModal = ({
  selectedBook,
  onCancel,
  onUpdateSuccess,
}: {
  selectedBook?: any;
  onCancel?: () => void;
  onUpdateSuccess?: () => void;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Form Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData(e.target);
    const updatedData = {
      title: formData.get("title"),
      author: formData.get("author"),
      fee: formData.get("fee"),
      category: formData.get("category"),
      description: formData.get("description"),
    };

    try {
      const res = await updateBookDetailsById(selectedBook._id, updatedData);
      if (
        res?.success ||
        (res?.result?.acknowledged && res?.result?.modifiedCount > 0)
      ) {
        toast.success(res?.message || "Book details updated successfully!");

        if (onUpdateSuccess) onUpdateSuccess();
        if (onCancel) onCancel();
      } else {
        toast.warning(res?.message || "No changes were made to update.");
      }
    } catch (error) {
      toast.error("Failed to update book details. Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 font-urbanist text-foreground">
      {/*Header*/}
      <div className="flex items-center justify-between border border-border bg-card rounded-3xl p-4 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <AnyButton
            isIconOnly
            variant="flat"
            radius="xl"
            onClick={onCancel}
            className="btn-secondary min-w-10 h-10 flex items-center justify-center p-0 text-foreground"
          >
            <ArrowLeft size={18} />
          </AnyButton>
          <div>
            <h3 className="text-xl font-bold font-poppins leading-tight">
              Edit Book Workspace
            </h3>
            <p className="text-base sm:text-sm text-muted-foreground">
              Modify metadata for:{" "}
              <span className="text-primary font-semibold">
                {selectedBook?.title}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side Image*/}
        <div className="lg:col-span-1">
          <div className="dashboard-card sticky top-6 space-y-5 text-center flex flex-col items-center justify-center">
            {selectedBook?.cover ? (
              <div className="relative w-40 h-56 rounded-2xl overflow-hidden border border-border/40 shadow-md">
                <img
                  src={selectedBook.cover}
                  alt={selectedBook.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-40 h-56 rounded-2xl bg-muted flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border">
                <BookOpen size={40} className="text-muted-foreground/60" />
                <span className="text-base sm:text-sm mt-2 font-semibold">
                  No Book Cover
                </span>
              </div>
            )}

            <div className="space-y-1 w-full overflow-hidden">
              <h4 className="font-bold font-poppins text-lg truncate px-2 text-foreground">
                {selectedBook?.title}
              </h4>
              <p className="text-base sm:text-sm text-muted-foreground truncate">
                by {selectedBook?.author}
              </p>
            </div>

            {/* status & requests */}
            <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-border/60 text-base sm:text-sm font-semibold">
              <div className="soft-card p-2 text-center rounded-2xl">
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wider mb-0.5">
                  Status
                </span>
                <span className="text-primary font-poppins font-bold">
                  {selectedBook?.status || "Pending"}
                </span>
              </div>
              <div className="soft-card p-2 text-center rounded-2xl">
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wider mb-0.5">
                  Requests
                </span>
                <span className="text-foreground font-poppins font-bold">
                  {selectedBook?.requests || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form*/}
        <div className="lg:col-span-2">
          <div className="dashboard-card">
            <form onSubmit={handleEditSubmit} className="space-y-5">
              {/* Book Title & Author Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="w-full space-y-1.5">
                  <label className="text-lg sm:text-base font-semibold text-foreground font-poppins">
                    Book Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter book title"
                    defaultValue={selectedBook?.title}
                    required
                    className="input-field"
                  />
                </div>

                <div className="w-full space-y-1.5">
                  <label className="text-lg sm:text-base font-semibold text-foreground font-poppins">
                    Author Name
                  </label>
                  <input
                    type="text"
                    name="author"
                    placeholder="Enter author name"
                    defaultValue={selectedBook?.author}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              {/* Category & Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="w-full space-y-1.5">
                  <label className="text-lg sm:text-base font-semibold text-foreground font-poppins">
                    Delivery Fee ($)
                  </label>
                  <input
                    type="number"
                    name="fee"
                    placeholder="0.00"
                    defaultValue={selectedBook?.fee}
                    required
                    className="input-field"
                  />
                </div>

                <div className="w-full space-y-1.5">
                  <label className="text-lg sm:text-base font-semibold text-foreground font-poppins">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. Fiction, Tech"
                    defaultValue={selectedBook?.category}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              {/* Description*/}
              <div className="w-full space-y-1.5">
                <label className="text-lg sm:text-base font-semibold text-foreground font-poppins">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder="Write a brief overview about the book contents..."
                  defaultValue={selectedBook?.description || ""}
                  className="input-field"
                />
              </div>

              {/*  অ্যাকশন বাটন গ্রুপ */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
                <AnyButton
                  onClick={onCancel}
                  variant="flat"
                  className="btn-secondary h-12 px-6 font-bold text-lg sm:text-base"
                >
                  Cancel
                </AnyButton>

                <AnyButton
                  type="submit"
                  isLoading={isUpdating}
                  className="btn-primary h-12 px-6 font-bold text-lg sm:text-base"
                  startContent={!isUpdating && <Save size={18} />}
                  spinner={
                    <RefreshCw
                      size={18}
                      className="animate-spin text-background dark:text-[#071a1d]"
                    />
                  }
                >
                  {isUpdating ? "Updating Data..." : "Update Book Details"}
                </AnyButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBookModal;
