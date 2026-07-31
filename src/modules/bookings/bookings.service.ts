
import { BookingStatus } from "../../../generated/prisma/client";
import env from "../../config/env";
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




const getBookingById = async (bookingId: string, userId: string, role: string) => {

   


   

    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId,
           
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
        throw new Error("Booking not found ");
    }

    if(role === "CUSTOMER" && booking.customerId !== userId){
    throw new Error("You are not authorized to view this booking ,May be you are not the owner of this booking or You are not Admin");
   }

   if(role === "TECHNICIAN" && booking.technicianId !== userId){
    throw new Error("You are not authorized to view this booking ,May be you are not the Technician of this booking or You are not Admin");
   }
   
   
    return booking;
}

const getMyBookingsintoDb = async (userId: string) => {
   const bookings = await prisma.bookings.findMany({
  where: {
    customerId: userId,
  },
  select: {
    id: true,
    status: true,
    bookingDate: true,
    startTime: true,
    endTime: true,

    service: {
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        location: true,
      },
    },

    technician: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  },
  orderBy: {
    bookingDate: 'desc',
  },
});

    if (!bookings) {
        throw new Error("No bookings created yet");
    }

    return bookings;
}



const GetMybookingDetailsById = async (userId: string, bookingId: string) => {
   const bookings = await prisma.bookings.findFirst({
  where: {
    customerId: userId,
    id: bookingId
  },
  select: {
    id: true,
    status: true,
    bookingDate: true,
    startTime: true,
    endTime: true,

    
  },
});

  

    if (!bookings) {
        throw new Error("No bookings created yet");
    }

    let message = "";
    let paymentLink = `${env.APP_URL}/api/payments/create/`;
    

  switch (bookings.status) {
    case "PENDING":
      message = "Please wait for the technician's response.";
      break;

    case "CONFIRMED":
      message = `Your booking has been accepted. You can now proceed with payment. please go to the payment section ${paymentLink} to complete the payment process.`;
     
      break;

    case "IN_PROGRESS":
      message = "The technician is currently working on your service.";
      break;

    case "COMPLETED":
      message = "Your service has been completed. Thank you for choosing our services!";
      break;

    case "CANCELED":
      message = "This booking has been cancelled. Please contact support for further assistance.";
      break;
  }

    return { bookingDetails: bookings, message, paymentLink };
}


const updateBookingStatusToAccept = async (bookingId: string) => {
     
    const booking = await prisma.bookings.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  switch (booking.status) {
    case BookingStatus.PENDING:
        break; // Allowed to accept for this stage

    case BookingStatus.CONFIRMED:
      throw new Error("This booking has already been accepted.");


    case BookingStatus.CANCELED:
      throw new Error("This booking has already been cancelled.");

    case BookingStatus.IN_PROGRESS:
      throw new Error("This booking is already in progress.");

    case BookingStatus.COMPLETED:
      throw new Error("This Booking Already completed booking.");
  }

  return prisma.bookings.update({
    where: {
      id: bookingId,
    },
    data: {
      status: BookingStatus.CONFIRMED,
    },
  });
}
const updateBookingStatusToStarted = async (bookingId: string) => {

    const booking = await prisma.bookings.findFirst({
        where: {
            id: bookingId,
            
        }
    });


        switch (booking?.status) {
        case BookingStatus.PENDING:
            throw new Error("Please wait for the technician to accept the booking.");

        case BookingStatus.CANCELED:
            throw new Error("This booking has been cancelled.");

        case BookingStatus.IN_PROGRESS:
            throw new Error("The service has already been started.");

        case BookingStatus.COMPLETED:
            throw new Error("The service has already been completed.");

        case BookingStatus.CONFIRMED:
            break; // Allowed to start for this stage 
        }


    const payment = await prisma.payment.findFirst({
        where: {
            bookingId: bookingId,
            status: "PAID"
        }
    });

    if (payment?.status !== "PAID") {
        throw new Error("Please wait for the payment to be completed before starting the service.");
    }


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

const updateBookingStatusToCanceled = async (bookingId: string) => {
  const booking = await prisma.bookings.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  switch (booking.status) {
    case BookingStatus.PENDING:
    case BookingStatus.CONFIRMED:
      break; // Allowed to cancel for this stage

    case BookingStatus.CANCELED:
      throw new Error("This booking has already been cancelled.");

    case BookingStatus.IN_PROGRESS:
      throw new Error("You cannot cancel a booking after the service has started.");

    case BookingStatus.COMPLETED:
      throw new Error("You cannot cancel a completed booking.");
  }

  return prisma.bookings.update({
    where: {
      id: bookingId,
    },
    data: {
      status: BookingStatus.CANCELED,
    },
  });
};

const updateBookingStatusToCompleted = async (bookingId: string) => {

  const booking = await prisma.bookings.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  switch (booking.status) {
    case BookingStatus.PENDING:
        throw new Error("Please wait for the technician response");
    

    case BookingStatus.CANCELED:
      throw new Error("This booking has already been cancelled.");

    case BookingStatus.IN_PROGRESS:
      throw new Error("You cannot cancel a booking after the service has started.");

    case BookingStatus.COMPLETED:
      throw new Error("You cannot cancel a completed booking.");

    case BookingStatus.CONFIRMED:
      break; // Allowed to complete for this stage
  }

  return prisma.bookings.update({
    where: {
      id: bookingId,
    },
    data: {
      status: BookingStatus.COMPLETED,
    },
  });
}

export default {
    createBooking,
    getBookingById,
    updateBookingStatusToAccept,
    updateBookingStatusToStarted,
    updateBookingStatusToCanceled,
    updateBookingStatusToCompleted,
    getMyBookingsintoDb,
    GetMybookingDetailsById
}