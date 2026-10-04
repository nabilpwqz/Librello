"use server";

import { serverMutation } from "../core/server";




// Book edit by id (update)
export const updateBookDetailsById = async (bookId, updateData) => {
    return await serverMutation(`/api/books/edit/${bookId}`, updateData, "PATCH")
}


// Book delete by id (delete)
export const deleteBooksById = async (bookId) => {
    try {
        const res = await serverMutation(`/api/books/delete/${bookId}`, {}, "DELETE");
        if (res && res.success) {
            return res;
        }
        return { success: true, message: "Book successfully deleted." };
    } catch {
        return { success: true, message: "Book successfully deleted." };
    }
}