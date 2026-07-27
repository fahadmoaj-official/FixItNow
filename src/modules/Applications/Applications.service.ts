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
};

const acceptApplicationIntoDb = async (
  serviceId: string,
  customerId: string,
  technicianId: string,
) => {
  const isOwner = await prisma.services.findFirst({
    where: {
      id: serviceId,
      customerId: customerId,
    },
  });

  if (!isOwner) {
    throw new Error(
      "You are not the owner of this service. You cannot accept applications for this service",
    );
  }

  // check already accepted application for this service
  const existingAcceptedApplication = await prisma.application.findFirst({
    where: {
      serviceId: serviceId,
      status: "ACCEPTED",
    },
  });

  if (existingAcceptedApplication) {
    throw new Error(
      "An application has already been accepted for this service",
    );
  }

  // update the application status to accepted
  const updatedApplication = await prisma.application.updateMany({
    where: {
      serviceId: serviceId,
      technicianId: technicianId,
    },
    data: {
      status: "ACCEPTED",
    },
  });

  if (updatedApplication.count === 0) {
    throw new Error("No application found for this service and technician");
  }

  return updatedApplication;
};

const rejectApplicationIntoDb = async (
  serviceId: string,
  customerId: string,
  technicianId: string,
) => {
  const isOwner = await prisma.services.findFirst({
    where: {
      id: serviceId,
      customerId: customerId,
    },
  });

  if (!isOwner) {
    throw new Error(
      "You are not the owner of this service. You cannot Reject applications for this service",
    );
  }

  // check already accepted application for this service
  const existingAcceptedApplication = await prisma.application.findFirst({
    where: {
      serviceId: serviceId,
      status: "REJECTED",
    },
  });

  if (existingAcceptedApplication) {
    throw new Error(
      "An application has already been rejected for this service",
    );
  }

  // update the application status to accepted
  const updatedApplication = await prisma.application.updateMany({
    where: {
      serviceId: serviceId,
      technicianId: technicianId,
    },
    data: {
      status: "REJECTED",
    },
  });

  if (updatedApplication.count === 0) {
    throw new Error("No application found for this service and technician");
  }

  return updatedApplication;
};


const withdrawApplicationintoDb = async (
  serviceId: string,
  technicianId: string,
) => {
  const isOwner = await prisma.services.findFirst({
    where: {
      id: serviceId,
      technicianId: technicianId,
    },
  });

  if (!isOwner) {
    throw new Error(
      "You are not the owner of this service. You cannot withdraw other Technician applications for this service",
    );
  }

  // check already accepted application for this service
  const existingAcceptedApplication = await prisma.application.findFirst({
    where: {
      serviceId: serviceId,
      status: "WITHDRAWN",
    },
  });

  if (existingAcceptedApplication) {
    throw new Error(
      "An application has already been withdrawn for this service",
    );
  }

  const transaction = await prisma.$transaction(async (tx) => {
        
  const updatedApplication = await prisma.application.updateMany({
    where: {
      serviceId: serviceId,
      technicianId: technicianId,
    },
    data: {
      status: "WITHDRAWN",
    },
  });

    // delete the application from the database after withdrawal
    const deletedApplication = await prisma.application.deleteMany({
        where: {
        serviceId: serviceId,
        technicianId: technicianId,
        },
    });

    if (deletedApplication.count === 0) {
    throw new Error("Alredy withdrawn or No application found for this service and technician");
   }

  });
  



  return transaction;
};

export const ApplicationsService = {
  applyToServiceIntoDb,
  getApplicationsForServiceFromDb,
  getApplicationsForTechnicianFromDb,
  acceptApplicationIntoDb,
  rejectApplicationIntoDb,
  withdrawApplicationintoDb,
};
