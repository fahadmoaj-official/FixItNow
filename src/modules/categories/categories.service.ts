import prisma from "../../lib/prisma";


const CreateACategoryIntoDb = async (categoryData: string) => {
 
    const category = await prisma.categories.create({
        data: {
            name: categoryData
        }
    });
    
    return category;
};


const GetAllCategoriesIntoDb = async () => {
  const categories = await prisma.categories.findMany();
  return categories;
};



export const CategoriesService = {
  GetAllCategoriesIntoDb,
  CreateACategoryIntoDb
};
