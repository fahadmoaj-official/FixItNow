import prisma from "../../lib/prisma";

interface ReviewPayload {
  rating: number;
  comment?: string;
  bookingId: string;
  technicianId: string;
  reviewerId: string;
}



const createReviewIntoDb = async (payload: ReviewPayload, customerId: string) => {

    const { rating, comment, bookingId, technicianId } = payload;

    // check if the booking status is completed
    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId,
            status: "COMPLETED",
        },
    });

    if (!booking || booking.customerId !== customerId) {
        throw new Error("Booking is not yet completed or does not exist");
    }

    const review = await prisma.review.create({
        data: {
            rating,
            comment,
            bookingId,
            technicianId,
            reviewerId: customerId,
        },
    });

    
 
    return review;
}


export const ReviewService = {
  createReviewIntoDb,
}