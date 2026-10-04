"use server";

import { protectedFetch, serverFetch } from "../core/server";
import { CURATED_ARCHIVAL_BOOKS, type BookItem } from "@/lib/constants/curatedBooks";


// Helper to filter and paginate local curated archival books
function filterCuratedBooks(searchString: string = "") {
  const params = new URLSearchParams(searchString);
  const search = params.get("search")?.toLowerCase().trim() || "";
  const category = params.get("category") || "all";
  const status = params.get("status") || "all";
  const minFee = params.get("minFee") ? Number(params.get("minFee")) : null;
  const maxFee = params.get("maxFee") ? Number(params.get("maxFee")) : null;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const perPage = Math.max(4, Number(params.get("perPage")) || 8);

  let result = CURATED_ARCHIVAL_BOOKS.filter((b) => {
    if (search) {
      const matchTitle = b.title.toLowerCase().includes(search);
      const matchAuthor = b.author.toLowerCase().includes(search);
      const matchCategory = b.category.toLowerCase().includes(search);
      if (!matchTitle && !matchAuthor && !matchCategory) return false;
    }

    if (category !== "all" && b.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }

    if (status !== "all") {
      if (status === "Available" && b.status !== "Published") return false;
      if (status === "Unavailable" && b.status !== "Checked Out") return false;
    }

    if (minFee !== null && b.fee < minFee) return false;
    if (maxFee !== null && b.fee > maxFee) return false;

    return true;
  });

  const totalItems = result.length;
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  const startIndex = (page - 1) * perPage;
  const paginated = result.slice(startIndex, startIndex + perPage);

  return {
    success: true,
    books: paginated,
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
      limit: perPage,
    },
  };
}

export const getAllPublishedBooks = async (searchString: string = "") => {
  try {
    const res = await serverFetch(`/api/books/publishedBooks?${searchString}`);
    const books = Array.isArray(res) ? res : res?.books;
    if (Array.isArray(books) && books.length > 0) {
      return res;
    }
    // Return curated books catalog when backend is empty or seeding is needed
    return filterCuratedBooks(searchString);
  } catch {
    return filterCuratedBooks(searchString);
  }
};

// Book details by id
export const getBooksDetailsById = async (bookId: string) => {
  try {
    const res = await serverFetch(`/api/books/details/${bookId}`);
    if (res && res._id) {
      return res;
    }
    // Find in curated books
    const fallback = CURATED_ARCHIVAL_BOOKS.find(
      (b) => b._id === bookId || b.id === bookId
    );
    return fallback || null;
  } catch {
    const fallback = CURATED_ARCHIVAL_BOOKS.find(
      (b) => b._id === bookId || b.id === bookId
    );
    return fallback || null;
  }
};

// Librarian books
export const getBooksByLibrarianId = async (librarianId: string) => {
  try {
    const res = await protectedFetch(`/api/books?librarianId=${librarianId}`);
    const list = Array.isArray(res) ? res : res?.books;
    if (Array.isArray(list) && list.length > 0) return res;
    return CURATED_ARCHIVAL_BOOKS.slice(0, 4);
  } catch {
    return CURATED_ARCHIVAL_BOOKS.slice(0, 4);
  }
};