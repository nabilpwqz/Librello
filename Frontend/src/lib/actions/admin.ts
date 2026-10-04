"use server";

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";



// admin status update korar jonno api
export const adminUpdateStatusById = async ({ bookId, status }) => {
    const res = await serverMutation(`/api/books/updateStatus/${bookId}`, { status }, "PATCH")
    revalidatePath("/dashboard/admin/manageBooks")
    return res;
}



// admin update approved status by id
export const adminUpdateApprovedStatusById = async ({ bookId, status }) => {
    return await serverMutation(`/api/books/approveStatus/${bookId}`, { status }, "PATCH")

}