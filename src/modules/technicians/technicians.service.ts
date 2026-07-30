import { BookingStatus } from "../../../generated/prisma/client";
import prisma from "../../lib/prisma"
import { TechnicianProfilePayload } from "./technicians.interface";

const getAllTechniciansIntoDb = async () => {
     const result = await prisma.user.findMany({
        where: {
            role: "TECHNICIAN"
        },
        include:{
            technician: true
        },
        omit:{
            password: true,
            createdAt: true,
            updatedAt: true
        }
     });
     
     if(!result || result.length === 0){
        throw new Error("No technicians found");
     }


     return result;
}

const getTechnicianByIdIntoDb = async (id:string) => {
    const result = await prisma.user.findUnique({
        where: {
            id: id
        },
        omit:{
            password: true,
            createdAt: true,
            updatedAt: true
        },include:{
            technician: true,
            reviewsReceived: {
                include: {
                    reviewer: true,
                }
            }
        }
    });

    if(!result){
        throw new Error("Technician not Exist");
    }

    return result;
}


const updateTechnicianProfileIntoDb = async (id:string,payload:TechnicianProfilePayload) => {


    


    const result = await prisma.technicianProfile.create({
        data: {
            userId: id,
            bio: payload.bio,
            skills: payload.skills,
            experienceYears: payload.experienceYears,
            isAvailable: payload.isAvailable
        }
    });

    if(!result){
        throw new Error("Failed to create technician profile");
    }

    return result;
}

const updateTechnicianAvailabilityIntoDb = async (userId:string, isAvailable:boolean) => {
    
     const result = await prisma.technicianProfile.update({
        where: {
            userId: userId
        },
        data: {
            isAvailable: isAvailable
        }
    });

    if(!result){
        throw new Error("Failed to update technician availability");
    }

    return result;

}

const GetTechnicianBookingsintoDb = async (technicianId: string) => {
    const result = await prisma.bookings.findMany({
        where: {
            technicianId: technicianId
        },
        include: {
            service: true,
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
        }
    });

    if(!result || result.length === 0){
        throw new Error("No bookings found for this technician");
    }

    return result;
}

const UpdateTechnicianBookingStatusIntoDb = async (technicianId: string, bookingId: string, status: BookingStatus) => {

    // check if the booking status is alredy same what you update
    const existingBooking = await prisma.bookings.findFirst({
        where: {
            id: bookingId,
            technicianId: technicianId,
            status: status
        }
    });

    if(existingBooking){
        throw new Error("Booking status is already set to the provided value");
    }

    const result = await prisma.bookings.updateMany({
        where: {
            id: bookingId,
            technicianId: technicianId
        },
        data: {
            status: status
        }
    });

    if(result.count === 0){
        throw new Error("Failed to update booking status. Either booking not found or you are not authorized to update this booking.");
    }
}

export const techniciansService = {
    getAllTechniciansIntoDb,
    getTechnicianByIdIntoDb,
    updateTechnicianProfileIntoDb,
    updateTechnicianAvailabilityIntoDb,
    GetTechnicianBookingsintoDb,
    UpdateTechnicianBookingStatusIntoDb
}