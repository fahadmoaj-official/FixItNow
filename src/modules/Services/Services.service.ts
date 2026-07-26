import prisma from "../../lib/prisma";
import { ServicesPayload } from "./Services.interface";

const CreateAServicesIntoDb = async (payload: ServicesPayload, customerId: string) => {
  const { title, description, categoryId, price, location } = payload;

  const service = prisma.services.create({
    data: {
      title,
      description,
      categoryId,
      price,
      location,
      customerId: customerId,
    },
  });


  return service;
};

const GetAllCategoriesIntoDb = async () => {};

export const ServicesService = {
  CreateAServicesIntoDb,
  GetAllCategoriesIntoDb,
};
