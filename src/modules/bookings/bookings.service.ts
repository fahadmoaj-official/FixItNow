
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

const getAllBookings = async (customerId: string) => {

    // Fetch all bookings for the given customerId
    const bookings = await prisma.bookings.findMany({
        where: {
            customerId
        },
        include: {
            service: true,
            technician: {
                select: {
                    id: true,
                    name: true,
                    email: true,                }
            }
        }
    });
    return bookings;
}
const getBookingById = async (bookingId: string) => {
    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId
        },
        include: {
            service: true,
            technician: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    return booking;
}

export default {
    createBooking,
    getAllBookings,
    getBookingById
}