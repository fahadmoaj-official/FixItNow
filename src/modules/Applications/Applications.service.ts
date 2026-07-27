import { UserRole } from "../../../generated/prisma/enums";
import prisma from "../../lib/prisma";

const applyToServiceIntoDb = async (
  serviceId: string,
  technicianId: string,
) => {
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
};

const getApplicationsForServiceFromDb = async (
  serviceId: string,
  userRole: string,
  customerId: string,
) => {
  const IsOwner = await prisma.services.findFirst({
    where: {
      id: serviceId,
      customerId: customerId,
    },
  });

  if (!IsOwner && userRole !== UserRole.ADMIN) {
    throw new Error(
      "You are not Owner for this service or you are not admin.You cannot view applications for this service",
    );
  }

  const applications = await prisma.application.findMany({
    where: {
      serviceId,
    },
    include: {
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      },
    },
  });

  if (applications.length === 0) {
    throw new Error("No applications found for this service");
  }

  return applications;
};


const getApplicationsForTechnicianFromDb = async (technicianId: string) => {

    const applications = await prisma.application.findMany({
        where: {
            technicianId,
        },
        include: {
            service: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true,
                    location: true,
                    status: true,

                },
            },
        },
    });

    if (applications.length === 0) {
        throw new Error("No applications found for this technician");
    }

    return applications;

}

export const ApplicationsService = {
  applyToServiceIntoDb,
  getApplicationsForServiceFromDb,
    getApplicationsForTechnicianFromDb,
};
