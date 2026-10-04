"use client";

// Client-side sanctuary persistent storage for offline-resilient state synchronization
// Manages reading shelf, bookmarks, circulation history, reviews, and reader preferences.

export interface ShelfItem {
  _id: string;
  bookId: string;
  bookTitle: string;
  author: string;
  category: string;
  bookCover: string;
  totalPages: number;
  currentPage: number;
  status: "Delivered" | "Return Requested" | "Returned" | "Dispatched";
  borrowedDate: string;
  dueDate: string;
  trackingId?: string;
  courierName?: string;
}

export interface CirculationRecord {
  _id: string;
  transactionId: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  author: string;
  category: string;
  amount: number;
  status: "Delivered" | "Dispatched" | "Pending" | "Return Requested" | "Returned";
  createdAt: string;
  returnDeadline: string;
  courierName: string;
  address?: string;
  deliveryNotes?: string;
}

export interface UserReviewItem {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  author?: string;
  rating: number;
  comment: string;
  createdAt: string;
  likes: number;
}

const STORAGE_KEYS = {
  SHELF: "librello_reading_shelf",
  CIRCULATION: "librello_circulation_history",
  REVIEWS: "librello_user_reviews",
  BOOKMARKS: "librello_shelf_bookmarks",
  PREFERENCES: "librello_user_preferences",
  DELETED_BOOKS: "librello_deleted_book_ids",
};

const DEFAULT_SHELF: ShelfItem[] = [
  {
    _id: "read-vol-01",
    bookId: "book-lib-01",
    bookTitle: "The Midnight Library",
    author: "Matt Haig",
    category: "Literature",
    bookCover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    totalPages: 304,
    currentPage: 168,
    status: "Delivered",
    borrowedDate: "2026-09-24T10:00:00.000Z",
    dueDate: "2026-10-08T10:00:00.000Z",
    trackingId: "LIB-TRK-984210",
    courierName: "Sanctuary White-Glove Dispatch",
  },
  {
    _id: "read-vol-02",
    bookId: "book-lib-03",
    bookTitle: "Ficciones",
    author: "Jorge Luis Borges",
    category: "Literature",
    bookCover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    totalPages: 174,
    currentPage: 120,
    status: "Delivered",
    borrowedDate: "2026-09-28T14:30:00.000Z",
    dueDate: "2026-10-12T14:30:00.000Z",
    trackingId: "LIB-TRK-741932",
    courierName: "Sanctuary Standard Dispatch",
  },
  {
    _id: "read-vol-03",
    bookId: "book-lib-06",
    bookTitle: "Letters to a Young Poet",
    author: "Rainer Maria Rilke",
    category: "Essays",
    bookCover:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
    totalPages: 144,
    currentPage: 144,
    status: "Return Requested",
    borrowedDate: "2026-09-15T09:00:00.000Z",
    dueDate: "2026-09-29T09:00:00.000Z",
    trackingId: "LIB-TRK-610284",
    courierName: "Sanctuary Standard Dispatch",
  },
];

const DEFAULT_CIRCULATION: CirculationRecord[] = [
  {
    _id: "circ-01",
    transactionId: "LIB-TRK-984210",
    bookId: "book-lib-01",
    bookTitle: "The Midnight Library",
    bookCover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    author: "Matt Haig",
    category: "Literature",
    amount: 4.5,
    status: "Delivered",
    createdAt: "2026-09-18T14:32:00.000Z",
    returnDeadline: "2026-10-02T14:32:00.000Z",
    courierName: "Sanctuary White-Glove Dispatch",
    address: "Sanctuary Reading Room 4B, 742 Evergreen Terrace",
  },
  {
    _id: "circ-02",
    transactionId: "LIB-TRK-741932",
    bookId: "book-lib-02",
    bookTitle: "Meditations: Annotated Imperial Edition",
    bookCover:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    author: "Marcus Aurelius",
    category: "Philosophy",
    amount: 3.5,
    status: "Dispatched",
    createdAt: "2026-09-28T09:15:00.000Z",
    returnDeadline: "2026-10-12T09:15:00.000Z",
    courierName: "Priority Archival Courier",
    address: "Sanctuary Reading Room 4B, 742 Evergreen Terrace",
  },
  {
    _id: "circ-03",
    transactionId: "LIB-TRK-610284",
    bookId: "book-lib-05",
    bookTitle: "Cosmos",
    bookCover:
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=800",
    author: "Carl Sagan",
    category: "Science",
    amount: 4.5,
    status: "Pending",
    createdAt: "2026-10-02T16:40:00.000Z",
    returnDeadline: "2026-10-16T16:40:00.000Z",
    courierName: "Sanctuary Standard Dispatch",
    address: "Sanctuary Reading Room 4B, 742 Evergreen Terrace",
  },
];

const DEFAULT_REVIEWS: UserReviewItem[] = [
  {
    _id: "rev-01",
    bookId: "book-lib-02",
    bookTitle: "Meditations: Annotated Imperial Edition",
    author: "Marcus Aurelius",
    bookImage:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    comment:
      "The physical binding of this edition has a quiet gravitas. Marcus Aurelius's entries on mortality and quiet endurance felt especially urgent during evening study in the reading room.",
    createdAt: "2026-09-22T11:20:00.000Z",
    likes: 18,
  },
  {
    _id: "rev-02",
    bookId: "book-lib-08",
    bookTitle: "Invisible Cities",
    author: "Italo Calvino",
    bookImage:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    comment:
      "Calvino turns memory and space into pure poetry. Each dialogue between Kublai Khan and Marco Polo is an architectural puzzle box that rewards slow, contemplative reading.",
    createdAt: "2026-09-26T16:45:00.000Z",
    likes: 24,
  },
  {
    _id: "rev-03",
    bookId: "book-lib-07",
    bookTitle: "Beyond Good and Evil",
    author: "Friedrich Nietzsche",
    bookImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    rating: 4,
    comment:
      "A searing, provocative work. The aphorisms in the fourth section require patience, but the translation provided by this Librello edition is remarkably clear and luminous.",
    createdAt: "2026-10-01T08:15:00.000Z",
    likes: 9,
  },
];

// Helper to safely read from localStorage
function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

// Helper to safely write to localStorage and dispatch custom event
function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("sanctuary_storage_updated", { detail: { key, value } }));
  } catch (err) {
    console.warn("Local storage write skipped:", err);
  }
}

// 1. READING SHELF METHODS
export const getStoredShelf = (): ShelfItem[] => {
  return getLocalItem<ShelfItem[]>(STORAGE_KEYS.SHELF, DEFAULT_SHELF);
};

export const saveStoredShelf = (items: ShelfItem[]): void => {
  setLocalItem(STORAGE_KEYS.SHELF, items);
};

export const updateStoredPageProgress = (volId: string, newPage: number): ShelfItem[] => {
  const current = getStoredShelf();
  const updated = current.map((item) => {
    if (item._id === volId || item.bookId === volId) {
      const clamped = Math.min(item.totalPages || 300, Math.max(0, newPage));
      return { ...item, currentPage: clamped };
    }
    return item;
  });
  saveStoredShelf(updated);
  return updated;
};

export const renewStoredVolumeLoan = (volId: string, daysToAdd = 14): ShelfItem[] => {
  const current = getStoredShelf();
  const updated = current.map((item) => {
    if (item._id === volId || item.bookId === volId) {
      const currentDue = new Date(item.dueDate).getTime();
      const extended = new Date(currentDue + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
      return { ...item, dueDate: extended };
    }
    return item;
  });
  saveStoredShelf(updated);
  return updated;
};

export const requestStoredVolumeReturn = (volId: string): ShelfItem[] => {
  const current = getStoredShelf();
  const updated = current.map((item) => {
    if (item._id === volId || item.bookId === volId) {
      return { ...item, status: "Return Requested" as const };
    }
    return item;
  });
  saveStoredShelf(updated);
  return updated;
};

// 2. CIRCULATION HISTORY METHODS
export const getStoredCirculation = (): CirculationRecord[] => {
  return getLocalItem<CirculationRecord[]>(STORAGE_KEYS.CIRCULATION, DEFAULT_CIRCULATION);
};

export const saveStoredCirculation = (records: CirculationRecord[]): void => {
  setLocalItem(STORAGE_KEYS.CIRCULATION, records);
};

export const addStoredCirculationLoan = (
  record: Omit<CirculationRecord, "_id" | "transactionId" | "createdAt" | "returnDeadline" | "status"> & {
    status?: CirculationRecord["status"];
    durationDays?: number;
  }
): { record: CirculationRecord; shelfItem: ShelfItem } => {
  const currentCirc = getStoredCirculation();
  const currentShelf = getStoredShelf();

  const timestamp = Date.now();
  const duration = record.durationDays || 14;
  const transactionId = `LIB-TRK-${Math.floor(100000 + Math.random() * 900000)}`;
  const createdAt = new Date().toISOString();
  const returnDeadline = new Date(timestamp + duration * 24 * 60 * 60 * 1000).toISOString();

  const newCircRecord: CirculationRecord = {
    _id: `circ-${timestamp}`,
    transactionId,
    bookId: record.bookId,
    bookTitle: record.bookTitle,
    bookCover: record.bookCover,
    author: record.author || "Curated Author",
    category: record.category || "Literature",
    amount: record.amount || 4.5,
    status: "Delivered",
    createdAt,
    returnDeadline,
    courierName: record.courierName || "Sanctuary White-Glove Dispatch",
    address: record.address || "Sanctuary Reading Room 4B",
    deliveryNotes: record.deliveryNotes || "",
  };

  const newShelfItem: ShelfItem = {
    _id: `shelf-${timestamp}`,
    bookId: record.bookId,
    bookTitle: record.bookTitle,
    author: record.author || "Curated Author",
    category: record.category || "Literature",
    bookCover: record.bookCover,
    totalPages: 320,
    currentPage: 0,
    status: "Delivered",
    borrowedDate: createdAt,
    dueDate: returnDeadline,
    trackingId: transactionId,
    courierName: record.courierName,
  };

  // Prepend new records
  const updatedCirc = [newCircRecord, ...currentCirc];
  const updatedShelf = [newShelfItem, ...currentShelf.filter((s) => s.bookId !== record.bookId)];

  saveStoredCirculation(updatedCirc);
  saveStoredShelf(updatedShelf);

  return { record: newCircRecord, shelfItem: newShelfItem };
};

// 3. REVIEWS & MARGINALIA METHODS
export const getStoredReviews = (): UserReviewItem[] => {
  return getLocalItem<UserReviewItem[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
};

export const saveStoredReviews = (reviews: UserReviewItem[]): void => {
  setLocalItem(STORAGE_KEYS.REVIEWS, reviews);
};

export const addStoredReview = (review: { bookId: string; bookTitle: string; bookImage: string; author?: string; rating: number; comment: string }): UserReviewItem => {
  const current = getStoredReviews();
  const newReview: UserReviewItem = {
    _id: `rev-${Date.now()}`,
    bookId: review.bookId,
    bookTitle: review.bookTitle,
    bookImage: review.bookImage,
    author: review.author || "Curated Author",
    rating: review.rating,
    comment: review.comment,
    createdAt: new Date().toISOString(),
    likes: 0,
  };

  const updated = [newReview, ...current];
  saveStoredReviews(updated);
  return newReview;
};

export const updateStoredReview = (id: string, text: string, rating: number): UserReviewItem[] => {
  const current = getStoredReviews();
  const updated = current.map((r) => (r._id === id ? { ...r, comment: text, rating } : r));
  saveStoredReviews(updated);
  return updated;
};

export const deleteStoredReview = (id: string): UserReviewItem[] => {
  const current = getStoredReviews();
  const updated = current.filter((r) => r._id !== id);
  saveStoredReviews(updated);
  return updated;
};

// 4. BOOKMARKS & WISHLIST METHODS
export const getStoredBookmarks = (): string[] => {
  return getLocalItem<string[]>(STORAGE_KEYS.BOOKMARKS, ["book-lib-01", "book-lib-03"]);
};

export const isBookmarked = (bookId: string): boolean => {
  const bookmarks = getStoredBookmarks();
  return bookmarks.includes(bookId);
};

export const toggleStoredBookmark = (bookId: string): boolean => {
  const current = getStoredBookmarks();
  let updated: string[];
  let isNowBookmarked: boolean;

  if (current.includes(bookId)) {
    updated = current.filter((id) => id !== bookId);
    isNowBookmarked = false;
  } else {
    updated = [...current, bookId];
    isNowBookmarked = true;
  }

  setLocalItem(STORAGE_KEYS.BOOKMARKS, updated);
  return isNowBookmarked;
};

export const updateStoredCirculationStatus = (
  idOrTransactionId: string,
  newStatus: "Delivered" | "Dispatched" | "Pending" | "Return Requested" | "Returned"
): CirculationRecord[] => {
  const current = getStoredCirculation();
  const updated = current.map((rec) => {
    if (rec._id === idOrTransactionId || rec.transactionId === idOrTransactionId) {
      return { ...rec, status: newStatus };
    }
    return rec;
  });
  saveStoredCirculation(updated);

  // If status is returned or delivered, sync reading shelf
  if (newStatus === "Return Requested" || newStatus === "Returned") {
    const shelf = getStoredShelf();
    const updatedShelf = shelf.map((s) => {
      const match = updated.find(
        (u) =>
          (u._id === idOrTransactionId || u.transactionId === idOrTransactionId) &&
          u.bookId === s.bookId
      );
      if (match) {
        return { ...s, status: newStatus };
      }
      return s;
    });
    saveStoredShelf(updatedShelf);
  }

  return updated;
};

// 5. READER PROFILE & PREFERENCES
export interface UserPreferences {
  bio: string;
  address: string;
  favoriteGenres: string[];
  fullName?: string;
}

export const getStoredPreferences = (): UserPreferences => {
  return getLocalItem<UserPreferences>(STORAGE_KEYS.PREFERENCES, {
    bio: "Avid bibliophile and collector of classical prose, architectural treatises, and speculative philosophy.",
    address: "Sanctuary Reading Room 4B, 742 Evergreen Terrace",
    favoriteGenres: ["Philosophy", "Literature", "History", "Science"],
  });
};

export const saveStoredPreferences = (prefs: Partial<UserPreferences>): UserPreferences => {
  const current = getStoredPreferences();
  const updated = { ...current, ...prefs };
  setLocalItem(STORAGE_KEYS.PREFERENCES, updated);
  return updated;
};

export const resetSanctuaryStorage = (): void => {
  if (typeof window === "undefined") return;
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    window.dispatchEvent(new CustomEvent("sanctuary_storage_updated", { detail: { reset: true } }));
  } catch (err) {
    console.warn("Storage reset failed:", err);
  }
};

// 6. DELETED / ERASED ARCHIVAL VOLUMES REGISTRY
export const getDeletedBookIds = (): string[] => {
  return getLocalItem<string[]>(STORAGE_KEYS.DELETED_BOOKS, []);
};

export const recordDeletedBookId = (bookId: string): void => {
  if (!bookId) return;
  const current = getDeletedBookIds();
  if (!current.includes(bookId)) {
    const updated = [...current, bookId];
    setLocalItem(STORAGE_KEYS.DELETED_BOOKS, updated);
  }
};

export const isBookDeleted = (bookId: string): boolean => {
  if (!bookId) return false;
  const list = getDeletedBookIds();
  return list.includes(bookId);
};

