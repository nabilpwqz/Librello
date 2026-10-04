"use server";

import { serverMutation } from "../core/server";

//  add payment post details
export const addPayment = async (paymentData) => {
    return await serverMutation("/api/payments", paymentData, "POST")
}

