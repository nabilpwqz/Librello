"use server"

import { protectedFetch, serverFetch } from "../core/server"


// user payments details get … by email
export const getUserPaymentDetailsByEmail = async (email) => {
    return await protectedFetch(`/api/payments/user/${email}`)
}



// all payments details get
export const getAllPaymentDetails = async () => {
    return await protectedFetch("/api/payments")
}


// user payments details get … by email total list get by id
export const getPaymentDetailsByLibrarianEmail = async (email) => {
    return await serverFetch(`/api/payments/librarian/${email}`)

}