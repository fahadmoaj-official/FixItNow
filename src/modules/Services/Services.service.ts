import prisma from "../../lib/prisma";
import { ServicesPayload } from "./Services.interface";

const CreateAServicesIntoDb = async (payload: ServicesPayload, customerId: string) => {
  const { title, description, categoryId, price, location } = payload;

  const existingCategory = await prisma.categories.findUnique({
    where: { id: categoryId },
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

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

const GetAllServicesIntoDb = async () => {
  const services = await prisma.services.findMany();
  return services;
};

const GetAllCategoriesIntoDb = async () => {
  const categories = await prisma.categories.findMany();
  return categories;
};

export const ServicesService = {
  CreateAServicesIntoDb,
  GetAllCategoriesIntoDb,
  GetAllServicesIntoDb,
};
