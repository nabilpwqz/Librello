export type UserRole = "user" | "librarian" | "admin";

export interface User {
  id: string;
  _id?: string;
  uid?: string;
  name: string;
  email: string;
  image?: string;
  photoURL?: string;
  role: UserRole;
  createdAt?: string | Date;
}

export interface AuthSession {
  user: User | null;
  token?: string | null;
}

export interface Book {
  _id?: string;
  id?: string;
  title: string;
  author: string;
  category: string;
  description: string;
  cover: string;
  status: "Published" | "Checked Out" | "Under Review" | "Rejected" | string;
  fee: number;
  librarianId?: string;
  librarianEmail?: string;
  tags?: string[];
  createdAt?: string;
  publishedDate?: string;
  isbn?: string;
  condition?: string;
  rating?: number;
}

export interface DeliveryPayment {
  _id?: string;
  id?: string;
  bookId: string;
  title: string;
  cover: string;
  fee: number;
  amount?: number;
  librarianId: string;
  librarianEmail: string;
  userId: string;
  userEmail: string;
  status: "Pending" | "Dispatched" | "Delivered" | "Returned" | "Cancelled" | string;
  createdAt?: string;
  month?: string;
}

export interface BookComment {
  _id?: string;
  id?: string;
  bookId: string;
  userId: string;
  userName: string;
  userImage?: string;
  comment: string;
  rating?: number;
  createdAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  result?: any;
  error?: string;
  count?: number;
  [key: string]: any;
}
