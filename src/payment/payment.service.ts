import { stripe } from "../lib/stripe"


const createPaymentIntoDb = async () => {
   const session = await stripe.checkout.sessions.create({})
}

const confirmPaymentIntoDb = async () => {

}

const getAllPaymentsFromDb = async () => {
    
}

const getPaymentByIdFromDb = async () => {
    
}

export const paymentService = {
    createPaymentIntoDb,
    confirmPaymentIntoDb,
    getAllPaymentsFromDb,
    getPaymentByIdFromDb
}