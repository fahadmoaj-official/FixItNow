
import { BookingStatus } from "../../../generated/prisma/client";
import prisma from "../../lib/prisma";
import { IBookingPayload } from "./bookings.interface";

const createBooking = async (payload: IBookingPayload, customerId: string) => {
    const { serviceId, technicianId, bookingDate, startTime, endTime } = payload

    const bookingDateTime = new Date(bookingDate);
    const startDateTime = new Date(`${bookingDate}T${startTime}:00`);

    const endDateTime = new Date(`${bookingDate}T${endTime}:00`);


    // if alredy booked for the same date and time, then throw error
    const existingBooking = await prisma.bookings.findFirst({
        where: {
            technicianId,
            bookingDate: bookingDateTime,
            AND: [
                {
                    startTime: {
                        lte: endDateTime //output: 2023-08-15T10:00:00.000Z
                    }
                },
                {
                    endTime: {
                        gte: startDateTime //output: 2023-08-15T09:00:00.000Z
                    }
                }
            ]
        }
    })

    if (existingBooking) {
        throw new Error("Technician is already booked for the selected date and time");
    }

    
    const booking = await prisma.bookings.create({
        data: {
            serviceId,
            customerId,
            technicianId,
            bookingDate : bookingDateTime,
            startTime : startDateTime,
            endTime : endDateTime
        }
    })

    return booking;
}




const getBookingById = async (bookingId: string, technicianId: string) => {
    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId,
            technicianId: technicianId
        },
        include: {
            service: true,
            technician: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    if (!booking) {
        throw new Error("Booking not found or you are not authorized to view this booking");
    }
    return booking;
}


const updateBookingStatusToAccept = async (bookingId: string) => {
     
    const result = await prisma.bookings.update({
        where: {
            id: bookingId
        },
        data: {
            status: BookingStatus.CONFIRMED
        }
    });
    return result;
}
const updateBookingStatusToStarted = async (bookingId: string) => {
     const result = await prisma.bookings.update({
        where: {
            id: bookingId
        },
        data: {
            status: BookingStatus.IN_PROGRESS
        }
    });
    return result;
}

const updateBookingStatusToRejected = async (bookingId: string) => {
     const result = await prisma.bookings.update({
        where: {
            id: bookingId
        },
        data: {
            status: BookingStatus.CANCELED
        }
    });
    return result;
}

const updateBookingStatusToCompleted = async (bookingId: string) => {
     const result = await prisma.bookings.update({
        where: {
            id: bookingId
        },
        data: {
            status: BookingStatus.COMPLETED
        }
    });
    return result;
}

export default {
    createBooking,
    getBookingById,
    updateBookingStatusToAccept,
    updateBookingStatusToStarted,
    updateBookingStatusToRejected,
    updateBookingStatusToCompleted
}