import { UserRole } from "../../../generated/prisma/enums"
import prisma from "../../lib/prisma";

const applyToServiceIntoDb = async (serviceId: string, technicianId: string) => {

    // Check if the technician has already applied to this service
    const existingApplication = await prisma.application.findFirst({
        where: {
            serviceId,
            technicianId,
        },
    });

    if (existingApplication) {
        throw new Error("You have already applied to this service");
    }

    // Create a new application
    const newApplication = await prisma.application.create({
        data: {
            serviceId,
            technicianId,
        },
    });

    return newApplication;
}



export const ApplicationsService = {
    applyToServiceIntoDb
}