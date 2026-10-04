"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import {
  Truck,
  User,
  BookOpen,
  Calendar,
  Check,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";
import { librarianUpdateDeliveryStatus } from "@/lib/actions/librarian";

const AnyButton = Button as any;

interface ManageDeliveriesProps {
  payments?: any[];
  books?: any[];
}

const ManageDeliveries = ({ payments = [], books = [] }: ManageDeliveriesProps) => {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState(Array.isArray(payments) ? payments : []);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    setDeliveries(Array.isArray(payments) ? payments : []);
  }, [payments]);

  //  বাটন ক্লিক করলে আইডি আর কারেন্ট স্ট্যাটাস নিয়ে সার্ভার অ্যাকশন হিট করার ফাংশন ভাই
  const handleStatusClick = async (deliveryId, currentStatus) => {
    try {
      setLoadingId(deliveryId);

      const data = await librarianUpdateDeliveryStatus(
        deliveryId,
        currentStatus,
      );

      if (data?.success || data?.insertedId || data?.result?.insertedId) {
        console.log(data);

        toast.success(`Delivery status updated successfully! `);
        router.refresh();
      } else {
        toast.error(data?.message || "Failed to update status.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoadingId(null);
    }
  };

  // Date format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Status Style
  const statusStyles = {
    Pending: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Dispatched: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "Return Requested": "bg-purple-500/10 text-purple-500 border-purple-500/20",
    Returned: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  return (
    <div className="space-y-6 font-urbanist text-foreground pt-4 w-full">
      {/* header section */}
      <div className="flex items-center gap-3 border-b border-border/60 pb-4">
        <div className="p-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl">
          <Truck size={22} />
        </div>
        <div>
          <h2 className="font-poppins font-bold text-xl tracking-tight">
            Manage Deliveries
          </h2>
          <p className="text-base sm:text-sm text-muted-foreground">
            Track and update platform-wide book shipments.
          </p>
        </div>
      </div>

      {deliveries.length === 0 ? (
        <div className="border border-border bg-card/40 rounded-3xl p-10 text-center text-muted-foreground flex flex-col items-center justify-center gap-2 shadow-sm">
          <Truck size={32} className="text-muted-foreground/60" />
          <p className="font-bold">No Deliveries Found</p>
        </div>
      ) : (
        <>
          {/*  Desktop View  */}
          <div className="hidden md:block border border-border bg-card/30 rounded-3xl shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground text-base sm:text-sm font-semibold uppercase tracking-wider border-b border-border">
                  <th className="p-4">
                    <span className="flex items-center gap-1.5">
                      <User size={13} /> Client Email
                    </span>
                  </th>
                  <th className="p-4">
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={13} /> Book Title
                    </span>
                  </th>
                  <th className="p-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} /> Order Date
                    </span>
                  </th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60 text-lg sm:text-base font-medium">
                {deliveries.map((delivery) => (
                  <tr
                    key={delivery._id}
                    className="transition-all hover:bg-muted/10"
                  >
                    <td className="p-4 font-bold text-foreground text-base sm:text-sm">
                      {delivery.userEmail} {/* Real time date format */}
                    </td>
                    <td className="p-4 text-muted-foreground font-poppins text-base sm:text-sm truncate max-w-[180px]">
                      {delivery.bookTitle}
                    </td>
                    <td className="p-4 text-muted-foreground text-base sm:text-sm">
                      {formatDate(delivery.createdAt || delivery.date)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${statusStyles[delivery.status] || statusStyles["Pending"]}`}
                      >
                        {delivery.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* status control button */}
                        {delivery.status === "Pending" && (
                          <AnyButton
                            size="sm"
                            color="primary"
                            variant="flat"
                            isLoading={loadingId === delivery._id}
                            onClick={() =>
                              handleStatusClick(delivery._id, delivery.status)
                            }
                            className="font-bold text-base sm:text-sm rounded-xl h-9"
                            endContent={<ArrowRight size={14} />}
                          >
                            Ship Book
                          </AnyButton>
                        )}
                        {delivery.status === "Dispatched" && (
                          <AnyButton
                            size="sm"
                            color="warning"
                            variant="flat"
                            isLoading={loadingId === delivery._id}
                            onClick={() =>
                              handleStatusClick(delivery._id, delivery.status)
                            }
                            className="font-bold text-base sm:text-sm rounded-xl h-9 text-amber-600"
                            endContent={<Check size={14} />}
                          >
                            Confirm Delivery 
                          </AnyButton>
                        )}
                        {delivery.status === "Delivered" && (
                          <span className="text-base sm:text-sm text-emerald-500/70 italic font-semibold">
                            Client Reading
                          </span>
                        )}
                        {delivery.status === "Return Requested" && (
                          <AnyButton
                            size="sm"
                            color="secondary"
                            variant="flat"
                            isLoading={loadingId === delivery._id}
                            onClick={() =>
                              handleStatusClick(delivery._id, delivery.status)
                            }
                            className="font-bold text-base sm:text-sm rounded-xl h-9 bg-purple-500/10 text-purple-500"
                            endContent={<Check size={14} />}
                          >
                            Receive Returned Book
                          </AnyButton>
                        )}
                        {delivery.status === "Returned" && (
                          <span className="text-base sm:text-sm text-gray-400 italic font-normal">
                            Returned to Shelf 
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/*  Mobile View*/}
          <div className="block md:hidden space-y-4">
            {deliveries.map((delivery) => (
              <div
                key={delivery._id}
                className="border border-border/80 bg-card/40 rounded-2xl p-4 shadow-sm space-y-3 transition-all active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      Client Email
                    </p>
                    <h4 className="font-bold text-foreground text-base sm:text-sm truncate max-w-[160px]">
                      {delivery.userEmail}
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border ${statusStyles[delivery.status] || statusStyles["Pending"]}`}
                  >
                    {delivery.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-b border-border/40 py-2.5 text-base sm:text-sm">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium mb-0.5">
                      Book Title
                    </p>
                    <p className="font-semibold text-foreground font-poppins truncate max-w-[130px]">
                      {delivery.bookTitle}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium mb-0.5">
                      Order Date
                    </p>
                    <p className="font-semibold text-foreground text-base sm:text-sm">
                      {formatDate(delivery.createdAt || delivery.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-1">
                  {delivery.status === "Pending" && (
                    <AnyButton
                      fullWidth
                      size="sm"
                      color="primary"
                      variant="flat"
                      isLoading={loadingId === delivery._id}
                      onClick={() =>
                        handleStatusClick(delivery._id, delivery.status)
                      }
                      className="font-bold text-base sm:text-sm rounded-xl h-9"
                      endContent={<ArrowRight size={14} />}
                    >
                      Ship Book
                    </AnyButton>
                  )}
                  {delivery.status === "Dispatched" && (
                    <AnyButton
                      fullWidth
                      size="sm"
                      color="warning"
                      variant="flat"
                      isLoading={loadingId === delivery._id}
                      onClick={() =>
                        handleStatusClick(delivery._id, delivery.status)
                      }
                      className="font-bold text-base sm:text-sm rounded-xl h-9 text-amber-600"
                      endContent={<Check size={14} />}
                    >
                      Mark as Delivered
                    </AnyButton>
                  )}
                  {delivery.status === "Delivered" && (
                    <div className="w-full text-center py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-base sm:text-sm text-emerald-600 font-bold italic">
                      Client Reading 
                    </div>
                  )}
                  {delivery.status === "Return Requested" && (
                    <AnyButton
                      fullWidth
                      size="sm"
                      color="secondary"
                      variant="flat"
                      isLoading={loadingId === delivery._id}
                      onClick={() =>
                        handleStatusClick(delivery._id, delivery.status)
                      }
                      className="font-bold text-base sm:text-sm rounded-xl h-9 bg-purple-500/10 text-purple-500"
                      endContent={<Check size={14} />}
                    >
                      Receive Returned Book
                    </AnyButton>
                  )}
                  {delivery.status === "Returned" && (
                    <div className="w-full text-center py-1.5 bg-gray-500/5 border border-gray-500/10 rounded-xl text-base sm:text-sm text-gray-500 font-medium italic">
                      Returned to Shelf 
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageDeliveries;
