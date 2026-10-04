"use server"

import { protectedFetch, serverFetch } from "../core/server"

// admin get all books
export const getAllBooks = async () => {
    return await protectedFetch("/api/books/allBooks")
}

// admin get all pending books
export const getAllPendingBooks = async () => {
    return await protectedFetch("/api/books/pendingBooks")
}

//  অ্যাডমিন ড্যাশবোর্ডের ৪টি কার্ডের কুইক স্ট্যাটাস কাউন্ট আনার অ্যাকশন 
export const getAdminStats = async () => {
    return await serverFetch("/api/admin/stats")
}

// পাই-চার্টের জন্য ক্যাটেগরি অনুযায়ী বইয়ের লাইভ কাউন্ট আনার অ্যাকশন 
export const getAdminBookCategories = async () => {
    return await serverFetch("/api/admin/book-categories")
}