"use server";

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";



// librarian id diye book status update
export const librarianUpdateDeliveryStatus = async (deliveryId, currentStatus) => {
    const res = await serverMutation(`/api/payments/updateStatus/${deliveryId}`, { currentStatus }, "PATCH");
    revalidatePath("/dashboard/librarian/manageDeliveries")
    return res;
}




// librarian books post korche
export const addBooksByLibrarian = async (bookData) => {
    return await serverMutation("/api/books", bookData, "POST")
}



// librarian id diye status toggle update
export const toggleBooksStatusById = async (
  arg1: any,
  arg2?: any
) => {
  const bookId = typeof arg1 === "object" ? arg1?.bookId : arg1;
  const currentStatus = typeof arg1 === "object" ? arg1?.currentStatus : arg2;
  try {
    const resData = await serverMutation(`/api/books/${bookId}`, { currentStatus }, "PATCH");
    revalidatePath("/dashboard/librarian/manageInventory");
    return resData;
  } catch (error) {
    console.error("Action Error:", error);
    return { success: false, message: "Server Action failed to execute." };
  }
};