import { BookingStatus } from "../../../generated/prisma/enums";


export interface IBookingPayload {
    serviceId: string;
    customerId: string;
    technicianId: string;
    status: BookingStatus;
    bookingDate: Date;
    startTime: Date;
    endTime: Date;
}