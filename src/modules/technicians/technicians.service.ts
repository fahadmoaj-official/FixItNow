import { BookingStatus } from "../../../generated/prisma/client";
import prisma from "../../lib/prisma"
import { TechnicianProfilePayload } from "./technicians.interface";

const getAllTechniciansIntoDb = async () => {
     const result = await prisma.user.findMany({
        where: {
            role: "TECHNICIAN"
        },
        include:{
            technicianProfiles: true
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
            technicianProfiles: true,
            reviewsReceived: {
                include: {
                    reviewer: true,
                }
            }
        }
    });

    const TotalReviews = await prisma.review.count({});

    if(!result){
        throw new Error("Technician not Exist");
    }

    return {result, TotalReviews};
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

const getAllBookingsforTechnician = async (technicianId: string) => {

    // Fetch all bookings for the given customerId
    const bookings = await prisma.bookings.findMany({
        where: {
            technicianId: technicianId,
            status: BookingStatus.PENDING
        },
        include: {
            service: true,
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,                
                }
            }
        }
    });
    if (!bookings || bookings.length === 0) {
        throw new Error("No Pending bookings found for this technician");
    }
    return bookings;
}



export const techniciansService = {
    getAllTechniciansIntoDb,
    getTechnicianByIdIntoDb,
    updateTechnicianProfileIntoDb,
    updateTechnicianAvailabilityIntoDb,
    getAllBookingsforTechnician
}