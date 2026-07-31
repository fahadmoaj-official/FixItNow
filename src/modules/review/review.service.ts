import prisma from "../../lib/prisma";


import { ReviewPayload } from "./review.interface";


const createReviewIntoDb = async (payload: ReviewPayload, customerId: string) => {

    const { rating, comment, bookingId, technicianId } = payload;

    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
    }

    const review = await prisma.$transaction(async (tx) => {

        const booking = await tx.bookings.findFirst({
            where: {
                id: bookingId,
                customerId,
                technicianId,
                status: "COMPLETED",
            },
        });

        if (!booking) {
            throw new Error("Booking is not yet completed or does not exist");
        }

        const existingReview = await tx.review.findFirst({
            where: {
                bookingId,
                reviewerId: customerId,
            },
        });

        if (existingReview) {
            throw new Error("You have already given a review for this booking");
        }

        const createdReview = await tx.review.create({
            data: {
                rating,
                comment,
                bookingId,
                technicianId,
                reviewerId: customerId,
            },
        });

        const ratingSummary = await tx.review.aggregate({
            where: {
                technicianId,
            },
            _avg: {
                rating: true,
            },
            _count: {
                id: true,
            },
        });

        const technicianProfile = await tx.technicianProfile.findUnique({
            where: {
                userId: technicianId,
            },
        });

        if (!technicianProfile) {
            throw new Error("Technician profile not found");
        }

        await tx.technicianProfile.update({
            where: {
                userId: technicianId,
            },
            data: {
                rating: ratingSummary._avg.rating ?? 0,
                totalReviews: ratingSummary._count.id,
            },
        });

        return createdReview;
    });

    return review;
}


export const ReviewService = {
  createReviewIntoDb,
}