"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { motion } from "framer-motion";

const AnyButton = Button as any;

const DeletedAssetScreen = () => {
  return (
    <div className="min-h-screen font-sans">
      <div className="max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </motion.div>

        <div className="space-y-2">
          <h3 className="text-2xl font-serif font-bold text-foreground">
            Volume Removed from Catalog
          </h3>
          <p className="text-base text-muted-foreground max-w-md mx-auto">
            This catalog listing has been deregistered from the Librello archive and is no longer available.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="/books">
            <AnyButton
              className="btn-primary h-12 px-6 text-sm font-bold uppercase tracking-wider rounded-xl shadow-sm flex items-center gap-2"
              startContent={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              }
            >
              Return to Catalog
            </AnyButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default DeletedAssetScreen;
