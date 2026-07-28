import prisma from "../../lib/prisma"
import { TechnicianProfilePayload } from "./technicians.interface";

const getAllTechniciansIntoDb = async () => {
     const result = await prisma.user.findMany({
        where: {
            role: "TECHNICIAN"
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


const createTechnicianProfileIntoDb = async (id:string,payload:TechnicianProfilePayload) => {


    


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

export const techniciansService = {
    getAllTechniciansIntoDb,
    getTechnicianByIdIntoDb,
    createTechnicianProfileIntoDb
}