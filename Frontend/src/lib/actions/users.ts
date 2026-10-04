"use server";


import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";


// user payment delivery status update
export const userBookReturnStatusUpdate = async (paymentId, currentStatus) => {
    const res = await serverMutation(`/api/payments/return/${paymentId}`, { currentStatus }, "PATCH");
    revalidatePath("/dashboard/user/myReadingList");
    return res;
}




// users comment post korche 
export const addUserComment = async (reviewPayload) => {
    return await serverMutation("/api/users/comments", reviewPayload, "POST")
}

// user comments edit by
export const updateUserCommentById = async (id, comment) => {
    const res = await serverMutation(`/api/users/comments/edit/${id}`, comment, "PATCH");
    revalidatePath("/dashboard/user/myReviews")
    return res;
}


// User delete comments by id 
export const deleteUserCommentById = async (id) => {
    const res = await serverMutation(`/api/users/comments/delete/${id}`, {}, "DELETE")
    revalidatePath("/dashboard/user/myReviews")
    return res;
}



// admin nije role change korbe 
export const updateUserRole = async ({ userId, userRole }) => {
    const res = await serverMutation(`/api/users/updateRole/${userId}`, { userRole }, "PATCH"
    )
    revalidatePath("/dashboard/admin/users")
    return res;
}


// admin user deleteUserById
export const deleteUserById = async (userId) => {
    const res = await serverMutation(`/api/users/delete/${userId}`, {}, "DELETE")
    revalidatePath("/dashboard/admin/users")
    return res;
}