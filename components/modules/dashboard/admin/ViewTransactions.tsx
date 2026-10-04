"use client";

import React from "react";
import {
  CreditCard,
  Mail,
  Calendar,
  Hash,
  ShieldCheck,
  DollarSign,
  Bookmark,
} from "lucide-react";

const ViewTransactions = ({ payments = [] }: { payments?: any }) => {
  const transactionList = Array.isArray(payments) ? payments : [];

  // Format timestamp safely into readable locale string
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 font-urbanist text-foreground pt-4 w-full">
      {/* Header section */}
      <div className="flex items-center gap-3 border-b border-border/60 pb-4">
        <div className="p-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl">
          <CreditCard size={22} />
        </div>
        <div>
          <h2 className="font-poppins font-bold text-xl tracking-tight">
            Financial Transactions
          </h2>
          <p className="text-base sm:text-sm text-muted-foreground">
            Platform-wide financial audit trail and logs.
          </p>
        </div>

        <div className="absolute top-0 right-12 w-8 h-16 bg-primary/20 border-x border-b border-primary/30 rounded-b-xl flex items-end justify-center pb-2 text-primary">
          <Bookmark size={14} className="fill-current" />
        </div>
      </div>

      {/* Conditional rendering for empty pipeline */}
      {transactionList.length === 0 ? (
        <div className="border border-border bg-card/40 rounded-3xl p-10 text-center text-muted-foreground flex flex-col items-center justify-center gap-2 shadow-sm">
          <CreditCard size={32} className="text-muted-foreground/60" />
          <p className="font-bold">No Transactions Recorded Yet</p>
        </div>
      ) : (
        /* Main data table layout */
        <div className="border border-border bg-card/30 rounded-3xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground text-base sm:text-sm font-semibold uppercase tracking-wider border-b border-border">
                <th className="p-4">
                  <span className="flex items-center gap-1.5">
                    <Hash size={13} /> Transaction ID
                  </span>
                </th>
                <th className="p-4">
                  <span className="flex items-center gap-1.5">
                    <Mail size={13} /> User Email
                  </span>
                </th>
                <th className="p-4">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={13} /> Librarian Email
                  </span>
                </th>
                <th className="p-4">
                  <span className="flex items-center gap-1.5">
                    <DollarSign size={13} /> Amount
                  </span>
                </th>
                <th className="p-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} /> Date
                  </span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60 text-lg sm:text-base font-medium">
              {transactionList.map((txn) => (
                <tr key={txn._id} className="transition-all hover:bg-muted/10">
                  {/* 1. Transaction ID - Binded with real transactionId field */}
                  <td className="p-4 font-mono text-base sm:text-sm font-bold text-primary select-all max-w-[200px] truncate">
                    {txn.transactionId || txn._id}
                  </td>

                  {/* 2. User Email */}
                  <td className="p-4 text-muted-foreground text-base sm:text-sm">
                    {txn.userEmail || "Unknown User"}
                  </td>

                  {/* 3. Librarian Email */}
                  <td className="p-4 text-muted-foreground/80 text-base sm:text-sm">
                    {txn.librarianEmail || "Unknown Librarian"}
                  </td>

                  {/* 4. Amount parsed in $ configuration */}
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-md text-base sm:text-sm font-bold font-poppins bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 whitespace-nowrap">
                      {txn.amount ? `${txn.amount} $` : "0 $"}
                    </span>
                  </td>

                  {/* 5. System timestamp configuration */}
                  <td className="p-4 text-muted-foreground text-base sm:text-sm whitespace-nowrap">
                    {formatDate(txn.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewTransactions;
